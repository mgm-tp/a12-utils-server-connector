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

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.client.match.MockRestRequestMatchers;
import org.springframework.test.web.client.response.MockRestResponseCreators;
import org.springframework.web.client.RestClient;

import com.mgmtp.a12.connector.ServerConnector;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@TestInstance(Lifecycle.PER_CLASS)
public class ConnectorTest {

	private RestServerConnectorFactory restConnectorFactory;
	private ObjectMapper mapper = new ObjectMapper();
	private RestClient.Builder restClientBuilder;

	@BeforeAll
	public void init() {
		restConnectorFactory = RestServerConnectorFactoryBuilder.create().withInterceptors(new AcceptHeaderInterceptor()).build();
		restClientBuilder = restConnectorFactory.getGenericRestConnector().getRestClientBuilder();
	}

	@Test
	public void checkGetConnector() throws Exception {
		checkConnector(HttpMethod.GET, restConnectorFactory.createRestGetConnector());
	}

	@Test
	public void checkPostConnector() throws Exception {
		checkConnector(HttpMethod.POST, restConnectorFactory.createRestPostConnector());
	}

	@Test
	public void checkPutConnector() throws Exception {
		checkConnector(HttpMethod.PUT, restConnectorFactory.createRestPutConnector());
	}

	@Test
	public void checkOptionsConnector() throws Exception {
		checkConnector(HttpMethod.OPTIONS, restConnectorFactory.createRestOptionsConnector());
	}

	@Test
	public void checkHeadConnector() throws Exception {
		checkConnector(HttpMethod.HEAD, restConnectorFactory.createRestHeadConnector());
	}

	@Test
	public void checkDeleteConnector() throws Exception {
		checkConnector(HttpMethod.DELETE, restConnectorFactory.createRestDeleteConnector());
	}

	private void checkConnector(HttpMethod method, ServerConnector<RestServerRequest<?>> connector) throws Exception {
		TestObject obj = new TestObject("123", 13);
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.add("Check", "Passed");
		URI uri = new URI("http://localhost:6666/test/13");

		mockRestClient(uri, method, responseHeaders, obj);
		RestServerResponse<TestObject> restResponse =
			(RestServerResponse<TestObject>) connector.callServer(uri.toString(), RestServerRequest.empty(), TestObject.class);
		assertResponse(restResponse, responseHeaders, obj);

		mockRestClient(uri, method, responseHeaders, obj);
		restResponse =
			(RestServerResponse<TestObject>) connector.callServer(uri, RestServerRequest.empty(), TestObject.class);
		assertResponse(restResponse, responseHeaders, obj);
	}

	private void mockRestClient(URI uri, HttpMethod method, HttpHeaders responseHeaders, TestObject obj) {
		try {
			MockRestServiceServer.bindTo(restClientBuilder).build().expect(ExpectedCount.once(),
					MockRestRequestMatchers.requestTo(uri))
				.andExpect(MockRestRequestMatchers.method(method))
				.andRespond(MockRestResponseCreators.withStatus(HttpStatus.OK)
					.contentType(MediaType.APPLICATION_JSON)
					.headers(responseHeaders)
					.body(mapper.writeValueAsString(obj)));
			// Rebuild RestClient to apply the mock request factory
			restConnectorFactory.getGenericRestConnector().rebuildRestClient();
		} catch (JacksonException e) {
			throw new RuntimeException(e);
		}
	}

	private void assertResponse(RestServerResponse<TestObject> restResponse, HttpHeaders responseHeaders, TestObject obj) {
		Assertions.assertEquals(responseHeaders.getFirst("check"), restResponse.getHeaders().getFirst("Check"));
		Assertions.assertEquals(obj, restResponse.getData());
		Assertions.assertEquals(HttpStatus.OK, restResponse.getStatusCode());
	}

}
