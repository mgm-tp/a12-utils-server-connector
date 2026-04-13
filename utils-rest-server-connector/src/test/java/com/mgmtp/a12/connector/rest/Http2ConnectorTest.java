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

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.OkHttp3ClientHttpRequestFactory;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import okhttp3.Connection;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.tls.HandshakeCertificates;
import okhttp3.tls.HeldCertificate;

@TestInstance(Lifecycle.PER_CLASS)
public class Http2ConnectorTest {

	private static MockWebServer server;
	private static String localhost;
	private RestServerConnectorFactory restConnectorFactory;
	private RestTemplate restTemplate;

	@BeforeAll
	public void init() throws UnknownHostException {
		restConnectorFactory = RestServerConnectorFactoryBuilder.create().withInterceptors(new AcceptHeaderInterceptor()).build();
		restTemplate = restConnectorFactory.getGenericRestConnector().getRestTemplate();
		localhost = InetAddress.getByName("localhost").getCanonicalHostName();
		server = new MockWebServer();
	}

	@Test
	public void checkH2RequestResponse() throws Exception {
		HeldCertificate localhostCertificate = new HeldCertificate.Builder()
			.addSubjectAlternativeName(localhost)
			.build();
		HandshakeCertificates serverCertificates = new HandshakeCertificates.Builder()
			.heldCertificate(localhostCertificate)
			.build();

		server.useHttps(serverCertificates.sslSocketFactory(), false);
		server.enqueue(new MockResponse());
		server.start();

		HandshakeCertificates clientCertificates = new HandshakeCertificates.Builder()
			.addTrustedCertificate(localhostCertificate.certificate())
			.build();

		HttpInterceptor httpInterceptor = new HttpInterceptor();
		OkHttpClient client = new OkHttpClient.Builder()
			.sslSocketFactory(clientCertificates.sslSocketFactory(), clientCertificates.trustManager())
			.addNetworkInterceptor(httpInterceptor)
			.build();

		ClientHttpRequestFactory requestFactory = restTemplate.getRequestFactory();
		OkHttp3ClientHttpRequestFactory okRequestFactory = (OkHttp3ClientHttpRequestFactory) ReflectionTestUtils.getField(requestFactory, "requestFactory");
		ReflectionTestUtils.setField(okRequestFactory, "client", client);

		RestGetConnector restGetConnector = restConnectorFactory.createRestGetConnector();
		restGetConnector.callServer("https://" + localhost + ":" + server.getPort() + "/test/13", RestServerRequest.empty(), Void.class);

		server.shutdown();
	}

	private static class HttpInterceptor implements Interceptor {
		@Override
		public Response intercept(Interceptor.Chain chain) throws IOException {

			Request request = chain.request();
			Connection connection = chain.connection();
			String requestGenerated = request.method()
				+ ' ' + request.url()
				+ (connection != null ? " " + connection.protocol() : "");
			String expectedRequest = "GET https://" + localhost + ":" + server.getPort() + "/test/13 h2";
			Assertions.assertEquals(expectedRequest, requestGenerated);
			Response response;
			try {
				response = chain.proceed(request);
			} catch (Exception e) {
				throw e;
			}
			String responseGenerated = response.protocol().name()
				+ ' ' + response.code()
				+ ' '
				+ response.request().url();
			String expectedResponse = "HTTP_2 200 https://" + localhost + ":" + server.getPort() + "/test/13";
			Assertions.assertEquals(expectedResponse, responseGenerated);
			return response;
		}
	}

}
