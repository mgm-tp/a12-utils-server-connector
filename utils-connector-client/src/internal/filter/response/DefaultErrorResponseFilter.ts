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
export class DefaultErrorResponseFilter {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	doFilterResponse(response: Response | undefined): Promise<{}> {
		if (response === undefined) {
			return Promise.resolve({});
		}
		const contentType = response.headers.get("content-type") || "";
		if (contentType === "application/json") {
			return response.json().then(t =>
				Promise.reject({
					status: response.status,
					content: t,
					header: response.headers,
					url: response.url
				})
			);
		} else if (contentType.indexOf("text") !== -1) {
			return response.text().then(t =>
				Promise.reject({
					status: response.status,
					content: t,
					header: response.headers,
					url: response.url
				})
			);
		} else {
			return Promise.reject(response);
		}
	}

	canHandleResponse(response: Response | undefined): boolean {
		if (!response) {
			return false;
		} else {
			if (response.ok) {
				return false;
			} else if (!(response && response.headers)) {
				return false;
			}
		}
		return true;
	}
}
