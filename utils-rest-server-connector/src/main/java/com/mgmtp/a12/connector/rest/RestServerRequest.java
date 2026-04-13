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

import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.mgmtp.a12.connector.ServerRequest;

/**
 * REST server request with default content type and accept = JSON
 *
 * @param <T> request payload type
 */
public class RestServerRequest<T> implements ServerRequest<T> {

	private T payload;
	private MediaType contentType = MediaType.APPLICATION_JSON;
	private MediaType accept = MediaType.APPLICATION_JSON;
	private MultiValueMap<String, String> additionalHeaders = new LinkedMultiValueMap<>();

	private RestServerRequest(T payload) {
		this.payload = payload;
	}

	public static <Out> RestServerRequest<Out> withPayload(Out payload) {
		return new RestServerRequest<Out>(payload);
	}

	public static RestServerRequest<Void> empty() {
		return new RestServerRequest<Void>(null);
	}

	@Override
	public T getPayload() {
		return payload;
	}

	public MediaType getContentType() {
		return contentType;
	}

	public void setContentType(MediaType contentType) {
		this.contentType = contentType;
	}

	public MediaType getAccept() {
		return accept;
	}

	public void setAccept(MediaType accept) {
		this.accept = accept;
	}

	public MultiValueMap<String, String> getAdditionalHeaders() {
		return additionalHeaders;
	}

	public void setAdditionalHeaders(MultiValueMap<String, String> additionalHeaders) {
		this.additionalHeaders = additionalHeaders;
	}

	public RestServerRequest<T> withContentType(MediaType contentType) {
		this.contentType = contentType;
		return this;
	}

	public RestServerRequest<T> withAccept(MediaType accept) {
		this.accept = accept;
		return this;
	}

	public RestServerRequest<T> withHeader(String name, String value) {
		additionalHeaders.add(name, value);
		return this;
	}

	public RestServerRequest<T> withAdditionalHeaders(MultiValueMap<String, String> additionalHeaders) {
		this.additionalHeaders.addAll(additionalHeaders);
		return this;
	}

	@Override
	public String toString() {
		return "RestServerRequest [payload=" + payload + ", contentType=" + contentType + ", accept=" + accept + ", additionalHeaders=" + additionalHeaders
			+ "]";
	}
}
