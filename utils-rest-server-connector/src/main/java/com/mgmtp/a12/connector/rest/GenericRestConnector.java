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
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import jakarta.validation.constraints.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import okhttp3.OkHttpClient;

public class GenericRestConnector {

	private static final Logger LOGGER = LoggerFactory.getLogger(GenericRestConnector.class);

	private RestTemplate restTemplate;

	public GenericRestConnector(OkHttpClient okHttpClient, ResponseErrorHandler errorHandler, List<HttpMessageConverter<?>> messageConvertes,
		ClientHttpRequestInterceptor... interceptors) {
		/*
		 *  We decided to keep this deprecated because upgrading to use JdkClientHttpRequestFactory from Spring resulted in a 413 Payload Too Large error
		 *  when creating the Document model from DataServices
		 */
		OkHttp3ClientHttpRequestFactory okHttp3ClientHttpRequestFactory =
			new OkHttp3ClientHttpRequestFactory(Optional.ofNullable(okHttpClient).orElseGet(GenericRestConnector::createDefaultOkHttpClient));

		restTemplate = new RestTemplate(okHttp3ClientHttpRequestFactory);

		restTemplate.setInterceptors(Arrays.asList(Optional.ofNullable(interceptors).orElse(new ClientHttpRequestInterceptor[0])));
		if (errorHandler != null) {
			restTemplate.setErrorHandler(errorHandler);
		}
		if (!CollectionUtils.isEmpty(messageConvertes)) {
			List<HttpMessageConverter<?>> existingConverters = restTemplate.getMessageConverters();
			existingConverters.addAll(messageConvertes);
			restTemplate.setMessageConverters(existingConverters);
		}
	}

	public GenericRestConnector(ResponseErrorHandler errorHandler,
		List<HttpMessageConverter<?>> messageConverters,
		ClientHttpRequestInterceptor... interceptor) {
		this(null, errorHandler, messageConverters,
			interceptor);
	}

	public <In, Out> ResponseEntity<Out> executeMethod(String url, HttpMethod method, @NotNull RestServerRequest<In> input, Class<Out> returnType)
		throws RestClientException {
		return restTemplate.exchange(url, method, buildHttpEntityRequest(input, url), returnType);
	}

	public <In, Out> ResponseEntity<Out> executeMethod(URI uri, HttpMethod method, @NotNull RestServerRequest<In> input, Class<Out> returnType)
		throws RestClientException {
		return restTemplate.exchange(uri, method, buildHttpEntityRequest(input, uri.toString()), returnType);
	}

	static OkHttpClient createDefaultOkHttpClient() {
		// Keep the timeout configuration are compatible with SimpleClientHttpRequestFactory
		return new OkHttpClient().newBuilder()
			.connectTimeout(0, TimeUnit.MILLISECONDS)
			.readTimeout(0, TimeUnit.MILLISECONDS)
			.writeTimeout(0, TimeUnit.MILLISECONDS)
			.build();
	}

	RestTemplate getRestTemplate() {
		return restTemplate;
	}

	private <In> HttpEntity<In> buildHttpEntityRequest(@NotNull RestServerRequest<In> input, String url) {
		Assert.notNull(input, "Input must be specified");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(input.getContentType());
		headers.setAccept(Collections.singletonList(input.getAccept()));
		headers.addAll(input.getAdditionalHeaders());

		HttpEntity<In> request = new HttpEntity<>(input.getPayload(), headers);
		String payloadType = Optional.ofNullable(input.getPayload()).map(payload -> payload.getClass().getName()).orElse("null");
		LOGGER.debug("Connecting to server URL=[{}], ContentType=[{}], Accept=[{}], AdditionalHeaders=[{}], PayloadType=[{}]", url,
			request.getHeaders().getContentType(), input.getAccept(), input.getAdditionalHeaders(), payloadType);

		return request;
	}
}
