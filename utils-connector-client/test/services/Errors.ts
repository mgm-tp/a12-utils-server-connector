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
/* tslint:disable:no-any*/
export class AlreadyExistsError extends Error {
	constructor(message?: string) {
		super("AlreadyExistsError:" + message);
	}
}
export function isAlreadyExistsError(e: unknown): e is AlreadyExistsError {
	const myError = e as Record<string, unknown>;
	return (
		!!myError &&
		typeof myError.message === "string" &&
		myError.message.startsWith("AlreadyExistsError:")
	);
}

export class NotFoundError extends Error {
	constructor(message?: string) {
		super("NotFoundError:" + message);
	}
}
export function isNotFoundError(e: unknown): e is NotFoundError {
	const myError = e as Record<string, unknown>;
	return (
		!!myError &&
		typeof myError.statusText === "string" &&
		myError.statusText.startsWith("NotFoundError:")
	);
}

export class NotUniqueError extends Error {
	constructor(message?: string) {
		super("NotUniqueError:" + message);
	}
}
export function isNotUniqueError(e: unknown): e is NotUniqueError {
	const myError = e as Record<string, unknown>;
	return (
		!!myError &&
		typeof myError.statusText === "string" &&
		myError.statusText.startsWith("NotUniqueError:")
	);
}
