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

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.apache.hc.client5.http.classic.HttpClient;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.converter.HttpMessageConverter;

public class RestServerConnectorFactory {

	private GenericRestConnector genericRestConnector;

	public RestServerConnectorFactory(ResponseErrorHandler[] errorHandlers, List<HttpMessageConverter<?>> messageConvertes,
		ClientHttpRequestInterceptor... interceptors) {
		this(null, errorHandlers, messageConvertes, interceptors);
	}

	public RestServerConnectorFactory(HttpClient httpClient, ResponseErrorHandler[] errorHandlers, List<HttpMessageConverter<?>> messageConverters,
		ClientHttpRequestInterceptor... interceptors) {
		List<ResponseErrorHandler> errorHandlersList = new LinkedList<>(Arrays.asList(Optional.ofNullable(errorHandlers).orElse(new ResponseErrorHandler[0])));
		DelegatingErrorHandler delegatingErrorHandler = new DelegatingErrorHandler(errorHandlersList);
		genericRestConnector = new GenericRestConnector(httpClient, delegatingErrorHandler, messageConverters, interceptors);
	}

	public RestGetConnector createRestGetConnector() {
		return new RestGetConnector(genericRestConnector);
	}

	public RestPostConnector createRestPostConnector() {
		return new RestPostConnector(genericRestConnector);
	}

	public RestPutConnector createRestPutConnector() {
		return new RestPutConnector(genericRestConnector);
	}

	public RestDeleteConnector createRestDeleteConnector() {
		return new RestDeleteConnector(genericRestConnector);
	}

	public RestOptionsConnector createRestOptionsConnector() {
		return new RestOptionsConnector(genericRestConnector);
	}

	public RestHeadConnector createRestHeadConnector() {
		return new RestHeadConnector(genericRestConnector);
	}

	GenericRestConnector getGenericRestConnector() {
		return genericRestConnector;
	}

}
