import { Transaction } from "../models";

export const ValidateTransaction = async (trxnId: string) => {
	const currentTransaction = await Transaction.findById(trxnId);
	if (currentTransaction) {
		if (currentTransaction.status.toLowerCase() !== 'failed') {
			return { status: true, currentTransaction };
		}
	}
	return { status: false, currentTransaction };
}
