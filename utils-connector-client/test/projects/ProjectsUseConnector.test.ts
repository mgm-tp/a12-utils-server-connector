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
import * as Assert from "node:assert";

import { ConnectorLocator, RestServerConnector } from "../../src/index.js";

import { RedirectResponseFilter } from "../uaa/RedirectResponseFilter.js";
import { ResponseFilter401 } from "../uaa/ResponseFilter401.js";
import { XsrfTokenFilter } from "../uaa/XsrfTokenFilter.js";
import { ResponseFilter404 } from "../services/ResponseFilter404.js";
import { ResponseFilter409 } from "../services/ResponseFilter409.js";
import { AuthorizationHeaderFilter } from "../uaa/AuthorizationHeaderFilter.js";

describe("com.mgmtp.a12.connector.projectsUseConnector", () => {
	it("UAA filters", () => {
		const authorizationHeaderFilter: AuthorizationHeaderFilter =
			new AuthorizationHeaderFilter();
		const xsrfTokenFilter: XsrfTokenFilter = new XsrfTokenFilter();

		const redirectResponseFilter: RedirectResponseFilter =
			new RedirectResponseFilter();
		const responseFilter401: ResponseFilter401 = new ResponseFilter401();

		const serverConnector: RestServerConnector = new RestServerConnector(
			"http://localhost:8080/api",
			[authorizationHeaderFilter, xsrfTokenFilter],
			[redirectResponseFilter, responseFilter401]
		);
		ConnectorLocator.createInstance(serverConnector);
		Assert.strictEqual(
			ConnectorLocator.getInstance().getServerConnector(),
			serverConnector,
			"server connector is different instance"
		);
	});

	it("BAP Services filters", () => {
		const responseFilter404: ResponseFilter404 = new ResponseFilter404();
		const responseFilter409: ResponseFilter409 = new ResponseFilter409();

		const serverConnector: RestServerConnector = new RestServerConnector(
			"http://localhost:8080/api",
			[],
			[responseFilter404, responseFilter409]
		);
		ConnectorLocator.createInstance(serverConnector);
		Assert.strictEqual(
			ConnectorLocator.getInstance().getServerConnector(),
			serverConnector,
			"server connector is different instance"
		);
	});

	it("BAP Client as final place for using everything", () => {
		const authorizationHeaderFilter: AuthorizationHeaderFilter =
			new AuthorizationHeaderFilter();
		const xsrfTokenFilter: XsrfTokenFilter = new XsrfTokenFilter();

		const redirectResponseFilter: RedirectResponseFilter =
			new RedirectResponseFilter();
		const responseFilter401: ResponseFilter401 = new ResponseFilter401();

		const responseFilter404: ResponseFilter404 = new ResponseFilter404();
		const responseFilter409: ResponseFilter409 = new ResponseFilter409();

		const serverConnector: RestServerConnector = new RestServerConnector(
			"http://localhost:8080/api",
			[authorizationHeaderFilter, xsrfTokenFilter],
			[
				redirectResponseFilter,
				responseFilter401,
				responseFilter404,
				responseFilter409
			]
		);
		ConnectorLocator.createInstance(serverConnector);
		Assert.strictEqual(
			ConnectorLocator.getInstance().getServerConnector(),
			serverConnector,
			"server connector is different instance"
		);
	});
});
