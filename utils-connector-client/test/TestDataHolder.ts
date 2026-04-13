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
/* eslint-disable @typescript-eslint/no-extraneous-class */

export class TestDataHolder {
	/* tslint:disable*/
	static testData(): unknown {
		return {
			status: 200,
			headers: {
				"content-type": "application/json"
			},
			body: {
				username: "admin",
				lastName: "min",
				fistName: "ad",
				roles: [
					{
						name: "systemAdmin",
						description: "system admin role",
						accessRights: [
							{
								name: "MANAGE_CACHES",
								description: "Manage system caches permission"
							},
							{
								name: "ACCESS_SYSTEM_DOCUMENTS",
								description: "Access System Documents permission"
							}
						]
					},
					{
						name: "admin",
						description: "admin role",
						accessRights: [
							{
								name: "DOCUMENT_READ",
								description: "Document READ permission"
							},
							{
								name: "DOCUMENT_WRITE",
								description: "Document WRITE permission"
							},
							{
								name: "MODEL_READ",
								description: "Model READ permission"
							},
							{
								name: "MODEL_WRITE",
								description: "Model WRITE permission"
							}
						]
					}
				],

				email: "test.admin@a12.dev.mgm-tp.com",
				links: []
			}
		};
	}

	static testData401(): Record<string, unknown> {
		return {
			status: 401,
			headers: {
				"content-type": "application/json"
			},
			body: {}
		};
	}

	static testData404(): Record<string, unknown> {
		return {
			status: 404,
			headers: {
				"content-type": "application/json"
			},
			body: {}
		};
	}

	static testData409(): Record<string, unknown> {
		return {
			status: 409,
			headers: {
				"content-type": "application/json"
			},
			body: {}
		};
	}

	static testData500(): Record<string, unknown> {
		return {
			status: 500,
			headers: {
				"content-type": "application/json"
			},
			body: {}
		};
	}
}
