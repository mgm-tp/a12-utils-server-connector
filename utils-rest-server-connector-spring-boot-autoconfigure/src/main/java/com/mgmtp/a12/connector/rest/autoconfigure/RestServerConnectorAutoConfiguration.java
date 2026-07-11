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
package com.mgmtp.a12.connector.rest.autoconfigure;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import jakarta.annotation.PostConstruct;
import jakarta.inject.Inject;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.converter.HttpMessageConverter;

import com.mgmtp.a12.connector.rest.ResponseErrorHandler;
import com.mgmtp.a12.connector.rest.RestDeleteConnector;
import com.mgmtp.a12.connector.rest.RestGetConnector;
import com.mgmtp.a12.connector.rest.RestHeadConnector;
import com.mgmtp.a12.connector.rest.RestOptionsConnector;
import com.mgmtp.a12.connector.rest.RestPostConnector;
import com.mgmtp.a12.connector.rest.RestPutConnector;
import com.mgmtp.a12.connector.rest.RestServerConnectorFactory;
import com.mgmtp.a12.connector.rest.RestServerConnectorFactoryBuilder;

@ComponentScan(basePackages = { "com.mgmtp.a12.connector.rest" })
public class RestServerConnectorAutoConfiguration {

	private RestServerConnectorFactory connectorFactory;

	@Inject
	private Optional<List<ClientHttpRequestInterceptor>> interceptors;
	@Inject
	private Optional<List<ResponseErrorHandler>> errorHandlers;
	@Inject
	private Optional<List<HttpMessageConverter<?>>> messageConverters;

	/**
	 * NOTE!!
	 * Be careful of circular dependencies! If a project initialize any type which is injected here
	 * and also needs any of the REST* client then it's a circular dependency and the method is called after all @Bean factory methods.
	 */
	@PostConstruct
	void initialize() throws Exception {
		connectorFactory = createServerConnectorFactory();
	}

	@Bean
	@ConditionalOnMissingBean

	public RestGetConnector restGetConnector() {
		return connectorFactory.createRestGetConnector();
	}

	@Bean
	@ConditionalOnMissingBean
	public RestPutConnector restPuttConnector() {
		return connectorFactory.createRestPutConnector();
	}

	@Bean
	@ConditionalOnMissingBean
	public RestPostConnector restPostConnector() {
		return connectorFactory.createRestPostConnector();
	}

	@Bean
	@ConditionalOnMissingBean
	public RestDeleteConnector restDeleteConnector() {
		return connectorFactory.createRestDeleteConnector();
	}

	@Bean
	@ConditionalOnMissingBean
	public RestOptionsConnector restOptionsConnector() {
		return connectorFactory.createRestOptionsConnector();
	}

	@Bean
	@ConditionalOnMissingBean
	public RestHeadConnector restHeadConnector() {
		return connectorFactory.createRestHeadConnector();
	}

	private RestServerConnectorFactory createServerConnectorFactory() {
		return RestServerConnectorFactoryBuilder
			.create()
			.withInterceptors(interceptors.orElseGet(Collections::emptyList).toArray(new ClientHttpRequestInterceptor[0]))
			.withErrorHandlers(errorHandlers.orElse(Collections.emptyList()).toArray(new ResponseErrorHandler[0]))
			.withMessageConverters(messageConverters.orElse(null))
			.build();
	}

}
