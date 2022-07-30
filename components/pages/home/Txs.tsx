import { FunctionComponent, useCallback, useState } from 'react';

import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';

import { DialogWrapper } from '@/components/common/DialogWrapper';
import { DisplayJson } from '@/components/common/DisplayJson';
import { useStore } from '@/hooks/common/useStore';
import { formatNum, truncateMiddle } from '@/utils/scripts';

interface Tx {
	height: string;
	hash: string;
	raw: any;
}

export const Txs: FunctionComponent = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [modalTx, setModalTx] = useState<Tx>();
	const {
		state: { txs },
	} = useStore();

	const data = txs as Tx[];

	const onClick = useCallback((tx: Tx) => {
		setModalTx(tx);
		setIsOpen(prevState => !prevState);
	}, []);

	return (
		<div className="flex flex-col h-full w-full gap-2">
			<DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
				{isOpen && <DisplayJson data={modalTx} />}
			</DialogWrapper>
			<p
				onClick={() => {
					toast('Copied to clipboard', { autoClose: 250 });
					copy(JSON.stringify(txs));
				}}
				className="text-center hover:text-accent cursor-pointer">
				Txs
			</p>
			<ul className="overflow-y-auto">
				{data.map((tx: Tx) => (
					<DisplayTx onClick={() => onClick(tx)} key={tx.hash} data={tx} />
				))}
			</ul>
		</div>
	);
};

const DisplayTx: FunctionComponent<{ data: Tx; onClick: () => void }> = ({ data, onClick }) => {
	return (
		<li
			onClick={onClick}
			className="flex font-mono items-center gap-5 truncate justify-center hover:text-accent cursor-pointer">
			<p className="text-[12px]">{formatNum(data.height)}</p>
			<p className="text-[12px]">{truncateMiddle(data.hash, 6, 6)}</p>
		</li>
	);
};
