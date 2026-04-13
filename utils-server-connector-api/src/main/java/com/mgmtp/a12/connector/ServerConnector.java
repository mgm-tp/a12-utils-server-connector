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
package com.mgmtp.a12.connector;

import java.net.URI;

/**
 * Protocol independent interface to call the server end-point.
 *
 */
public interface ServerConnector<In extends ServerRequest<?>> {

	/**
	 * Call the server end-point.
	 *
	 * @param <Out> Output data tape.
	 * @param address server end-point address.
	 * @param input Input data.
	 * @param returnType Type of the response data.
	 *
	 * @return wrapped response data.
	 */
	<Out> ServerResponse<Out> callServer(String address, In input, Class<Out> returnType);

	/**
	 * Call the server end-point.
	 *
	 * @param <Out> Output data tape.
	 * @param uri the URL.
	 * @param input Input data.
	 * @param returnType Type of the response data.
	 *
	 * @return wrapped response data.
	 */
	default <Out> ServerResponse<Out> callServer(URI uri, In input, Class<Out> returnType) {
		return callServer(uri.toString(), input, returnType);
	}

}
