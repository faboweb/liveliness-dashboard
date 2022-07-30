import { createContext, FunctionComponent, ReactNode, useMemo, useState } from 'react';

import { Context } from './types';

const initContext = (): Context => ({
	txs: [],
	nodeConfig: {},
	blocks: [],
	proposals: [],
	events: {},
	contracts: [],
});

export const StoreContext = createContext<AppContext>(null!);

export interface NodeConfig {
	channels: string;
	id: number[];
	listenAddr: string;
	moniker: string;
	network: string;
	other: Record<string, string>;
	protocolVersion: {
		app: number;
		block: number;
		p2p: number;
	};
	version: string;
}

export type AppContext = {
	state: Context;
	pushTx: (tx: any) => void;
	pushTxs: (txs: any[]) => void;
	setNodeConfig: (nodeConfig: NodeConfig) => void;
	pushBlocks: (block: any) => void;
	setBlocks: (blocks: any[]) => void;
	pushProposals: (proposals: any) => void;
	pushEvents: (event: any) => void;
	pushContracts: (contracts: any) => void;
};

export const StoreProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
	const [state, setState] = useState(initContext());
	const methods = useMemo(
		() => ({
			pushTx: (tx: any) => setState(prev => ({ ...prev, txs: [...prev.txs, tx] })),
			pushTxs: (tx: any[]) => setState(prev => ({ ...prev, txs: [...prev.txs, ...tx] })),
			setNodeConfig: (nodeConfig: NodeConfig) => setState(prev => ({ ...prev, nodeConfig })),
			pushBlocks: (block: any) => setState(prev => ({ ...prev, blocks: [...prev.blocks, block] })),
			setBlocks: (blocks: any) => setState(prev => ({ ...prev, blocks })),
			pushProposals: (proposals: any) => setState(prev => ({ ...prev, proposals: [...prev.proposals, ...proposals] })),
			pushEvents: (event: any) =>
				setState(prev => {
					const { events } = prev;
					events[event.type] = [...events[event.type], event];
					return { ...prev, events };
				}),
			pushContracts: (contracts: any) => setState(prev => ({ ...prev, contracts })),
		}),
		[]
	);
	const value = {
		state,
		...methods,
	};
	return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
