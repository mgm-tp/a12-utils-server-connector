/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */
package com.mgmtp.a12.connector.rest;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import jakarta.validation.constraints.NotNull;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.config.ConnectionConfig;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.core5.http.io.SocketConfig;
import org.apache.hc.core5.util.Timeout;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

public class GenericRestConnector {

	private static final Logger LOGGER = LoggerFactory.getLogger(GenericRestConnector.class);
	private static final Timeout DEFAULT_TIMEOUT = Timeout.ofMinutes(5);

	private RestClient restClient;
	private final RestClient.Builder restClientBuilder;

	public GenericRestConnector(HttpClient httpClient, ResponseErrorHandler errorHandler, List<HttpMessageConverter<?>> messageConverters,
		ClientHttpRequestInterceptor... interceptors) {
		HttpComponentsClientHttpRequestFactory requestFactory =
			new HttpComponentsClientHttpRequestFactory(Optional.ofNullable(httpClient).orElseGet(GenericRestConnector::createDefaultHttpClient));

		List<ClientHttpRequestInterceptor> allInterceptors = Arrays.asList(
			Optional.ofNullable(interceptors).orElse(new ClientHttpRequestInterceptor[0]));

		this.restClientBuilder = RestClient.builder()
			.requestFactory(requestFactory);

		restClientBuilder.configureMessageConverters(converters -> {
			converters.registerDefaults();
			if (!CollectionUtils.isEmpty(messageConverters)) {
				messageConverters.forEach(converters::addCustomConverter);
			}
		});

		if (!allInterceptors.isEmpty()) {
			restClientBuilder.requestInterceptors(list -> list.addAll(allInterceptors));
		}

		if (errorHandler != null) {
			restClientBuilder.defaultStatusHandler(
				HttpStatusCode::isError,
				errorHandler::handleError
			);
		}

		this.restClient = restClientBuilder.build();
	}

	public GenericRestConnector(ResponseErrorHandler errorHandler,
		List<HttpMessageConverter<?>> messageConverters,
		ClientHttpRequestInterceptor... interceptor) {
		this(null, errorHandler, messageConverters, interceptor);
	}

	public <In, Out> ResponseEntity<Out> executeMethod(String url, HttpMethod method, @NotNull RestServerRequest<In> input, Class<Out> returnType)
		throws RestClientException {
		return executeRequest(URI.create(url), method, input, returnType);
	}

	public <In, Out> ResponseEntity<Out> executeMethod(URI uri, HttpMethod method, @NotNull RestServerRequest<In> input, Class<Out> returnType)
		throws RestClientException {
		return executeRequest(uri, method, input, returnType);
	}

	private <In, Out> ResponseEntity<Out> executeRequest(URI uri, HttpMethod method, @NotNull RestServerRequest<In> input, Class<Out> returnType) {
		Assert.notNull(input, "Input must be specified");

		logRequest(uri.toString(), input);

		RestClient.RequestBodySpec requestSpec = restClient.method(method)
			.uri(uri)
			.contentType(input.getContentType())
			.accept(input.getAccept())
			.headers(headers -> input.getAdditionalHeaders().forEach(headers::addAll));

		if (input.getPayload() != null) {
			requestSpec.body(input.getPayload());
		}

		return requestSpec
			.retrieve()
			.toEntity(returnType);
	}

	private <In> void logRequest(String url, RestServerRequest<In> input) {
		String payloadType = Optional.ofNullable(input.getPayload())
			.map(payload -> payload.getClass().getName())
			.orElse("null");
		LOGGER.debug("Connecting to server URL=[{}], ContentType=[{}], Accept=[{}], AdditionalHeaders=[{}], PayloadType=[{}]",
			url, input.getContentType(), input.getAccept(), input.getAdditionalHeaders(), payloadType);
	}

	static HttpClient createDefaultHttpClient() {
		ConnectionConfig connectionConfig = ConnectionConfig.custom()
			.setConnectTimeout(DEFAULT_TIMEOUT)
			.build();

		SocketConfig socketConfig = SocketConfig.custom()
			.setSoTimeout(DEFAULT_TIMEOUT)
			.build();

		PoolingHttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder.create()
			.setDefaultConnectionConfig(connectionConfig)
			.setDefaultSocketConfig(socketConfig)
			.build();

		RequestConfig requestConfig = RequestConfig.custom()
			.setResponseTimeout(DEFAULT_TIMEOUT)
			.setConnectionRequestTimeout(DEFAULT_TIMEOUT)
			.build();

		return HttpClients.custom()
			.evictIdleConnections(DEFAULT_TIMEOUT)
			.evictExpiredConnections()
			.setConnectionManager(connectionManager)
			.setDefaultRequestConfig(requestConfig)
			.build();
	}

	RestClient getRestClient() {
		return restClient;
	}

	/**
	 * Returns the RestClient.Builder for testing purposes.
	 * Use this with MockRestServiceServer.bindTo(builder) in tests.
	 * After binding, call rebuildRestClient() to apply the mock.
	 */
	RestClient.Builder getRestClientBuilder() {
		return restClientBuilder;
	}

	/**
	 * Rebuilds the RestClient from the builder for testing purposes.
	 * Call this after MockRestServiceServer.bindTo(builder) to apply the mock request factory.
	 */
	void rebuildRestClient() {
		this.restClient = restClientBuilder.build();
	}
}
