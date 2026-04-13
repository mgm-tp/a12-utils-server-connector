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
/**
 * If you would like to manipulate your response init instance.
 * Please create a new @ResponseFilter and register in @RestServerConnector
 *
 * @ResponseFilter works different than @RequestFilter
 * - you can't change anything in the response promise.
 * - You can only react to a certain error code return or error message in the payload return from response.
 * - The original response will be return for your fetch method.
 * - In case you have any filters which handles the error then @Promise<@Response> will failed and original
 * 	ReponsePromise will be ignored.
 */
export interface ResponseFilter {
	canHandleResponse(response: Response | undefined): boolean;
	doResponseFilter(response: Response | undefined): ResponseFilterResult;
}

/**
 * When filter is passed proper result should be return as this structure.
 * - response: Response result
 * - continue: you can stop the filterChain if you think this is my last filter by set it to FALSE
 * - error: pass your error here so we can stop the response promise with Reject
 */
export interface ResponseFilterResult {
	readonly response: Response | undefined;
	readonly error?: Error;
	readonly continue: boolean;
}
