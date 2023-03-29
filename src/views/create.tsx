import { Transition } from '@headlessui/react';
import { Button, Card, CopyClipboard, Input, Dropdown, Skeleton, ProgressIndicator } from '../components';
import { useTrade } from '../hooks/trade';
import { BASE_URL } from '../utils/common';
import { TOKENS } from '../utils/token-list';

export const CreateView = () => {
    const { broadcastTrade, loading, trade, order, updateTrade, steps } = useTrade();
    return (
        <div className="flex flex-col gap-6">
            <Card className="self-center" header="Create Trade">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-0 items-start">
                    <Dropdown 
                        title="In Details"
                        placeholder="Please select a token..."
                        state={trade.tokenIn}
                        setState={updateTrade}
                        type="tokenIn"
                        search
                    />
                    <Input
                        placeholder="Amount to Trade"
                        value={trade.amountIn}
                        onChange={({ currentTarget }) =>
                            updateTrade('amountIn', currentTarget.value)
                        }
                        type="number"
                        token={trade.tokenIn || true}
                        maxClick={updateTrade}
                    />
                    <Dropdown 
                        title="Out Details"
                        placeholder="Please select a token..."
                        state={trade.tokenOut}
                        setState={updateTrade}
                        type="tokenOut"
                        search
                    />
                    <Input
                        placeholder="Amount to Receive"
                        value={trade.amountOut}
                        onChange={({ currentTarget }) =>
                            updateTrade('amountOut', currentTarget.value.toUpperCase())
                        }
                        type="number"
                        token={trade.tokenOut || true}
                        maxClick={updateTrade}
                    />
                </div>
                <Button
                    className="mt-6 w-full"
                    loadingText="Broadcasting"
                    loading={loading}
                    onClick={broadcastTrade}
                    disabled={
                        !trade.amountIn || !trade.amountOut || !trade.tokenIn || !trade.tokenOut
                    }
                >
                    Broadcast Trade
                </Button>
            </Card>
            
            <div className="mx-auto">
                <ProgressIndicator steps={steps} />
            </div>

            <Transition
                show={!!order.orderHash && !!order.multiAddr}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="flex flex-col justify-center items-center text-center"
            >
                <p className="text-sm">Trade Link:</p>
                <CopyClipboard value={`${BASE_URL}${order.multiAddr}/${order.orderHash}`} icon lg />
            </Transition>
        </div>
    );
};
