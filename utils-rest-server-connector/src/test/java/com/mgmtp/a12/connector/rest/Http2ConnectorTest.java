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

import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.net.ssl.SSLContext;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.io.HttpClientConnectionManager;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import okhttp3.tls.HandshakeCertificates;
import okhttp3.tls.HeldCertificate;

@TestInstance(Lifecycle.PER_CLASS)
public class Http2ConnectorTest {

	private static MockWebServer server;
	private static String localhost;

	@BeforeAll
	public void init() throws UnknownHostException {
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

		// Create SSL context that trusts the server certificate
		SSLContext sslContext = SSLContextBuilder.create()
			.loadTrustMaterial((chain, authType) -> true) // Trust all for testing
			.build();

		// Create HttpClient with custom SSL context
		HttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder.create()
			.setSSLSocketFactory(SSLConnectionSocketFactoryBuilder.create()
				.setSslContext(sslContext)
				.build())
			.build();

		HttpClient httpClient = HttpClients.custom()
			.setConnectionManager(connectionManager)
			.build();

		RestServerConnectorFactory restConnectorFactory = RestServerConnectorFactoryBuilder.create()
			.withInterceptors(new AcceptHeaderInterceptor())
			.withHttpClient(httpClient)
			.build();

		RestGetConnector restGetConnector = restConnectorFactory.createRestGetConnector();
		restGetConnector.callServer("https://" + localhost + ":" + server.getPort() + "/test/13", RestServerRequest.empty(), Void.class);

		// Verify the request was received
		RecordedRequest recordedRequest = server.takeRequest();
		Assertions.assertEquals("GET", recordedRequest.getMethod());
		Assertions.assertEquals("/test/13", recordedRequest.getPath());

		server.shutdown();
	}

}
