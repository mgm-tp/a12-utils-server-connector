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
import { RestRequestPayload } from "../../connector/RestServerConnector.js";

/**
 * If you would like to manipulate your request init instance.
 * Please create a new RequestFilter and register in @RestServerConnector
 */
export interface RequestFilter {
	canHandleRequest(requestPayload: RequestFilterPayload): boolean;
	doRequestFilter(requestPayload: RequestFilterPayload): RequestFilterResult;
}

/**
 * When filter is passed proper result should be return as this structure.
 * - request: @RequestInit for your fetch.
 * - continue: you can stop the filterChain if you think this is my last filter by set it to FALSE
 */
export interface RequestFilterResult {
	readonly request: RequestInit;
	readonly continue: boolean;
}

/**
 * Runtime payload
 * - payload: runtime data which can be passed in fetch method @RestRequestPayload
 * - request: @RequestInit for each filter
 */
export interface RequestFilterPayload {
	readonly payload: RestRequestPayload;
	readonly request: RequestInit;
}
