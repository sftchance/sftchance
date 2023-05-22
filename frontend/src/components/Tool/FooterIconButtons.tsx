import { useState } from 'react';
import { faBezierCurve, faCog, faPlay, faPause, faRefresh, faShuffle } from '@fortawesome/free-solid-svg-icons';

import { FooterIconButtonsProps } from '../../types';

import { IconButton } from './';

const FooterIconButtons = ({ paused, perfect, id, onPause, onReset, onShuffle, onWand }: FooterIconButtonsProps) => {
    id;

    const [advanced, setAdvanced] = useState<boolean>(false);

    const [amount, setAmount] = useState<number>(1);
    const [to, setTo] = useState<string>('');

    return (
        <div className="icon-buttons bottom">
            <div className="icons">
                <IconButton className="pause" icon={paused ? faPlay : faPause} onClick={onPause} />

                <IconButton className="reset" icon={faRefresh} onClick={onReset} />

                <IconButton className="shuffle" icon={faShuffle} onClick={onShuffle} />

                <IconButton
                    className={`wand ${perfect === true ? 'hidden-display' : ''}`}
                    icon={faBezierCurve}
                    onClick={onWand}
                />

                <IconButton
                    className="settings"
                    icon={faCog}
                    onClick={() => {
                        setAdvanced(!advanced);
                    }}
                />
            </div>

            <div className="minting">
                <div className="holders">
                    <div className="holders-container">
                        <div className="holder" />
                        <div className="holder" />
                        <div className="holder" />
                    </div>

                    <p>6.1k / 10k held by 57 owners.</p>
                </div>

                <div className="mint-button">
                    <button>Mint</button>
                </div>
            </div>

            <div className={`advanced ${!advanced ? 'hidden-display' : ''}`}>
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <select id="amount" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))}>
                        <option value={1}>1</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="to">To</label>
                    <input type="text" id="to" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
            </div>

            {/* <p
                style={{
                    wordBreak: 'break-all',
                    whiteSpace: 'normal',
                    fontVariantNumeric: 'tabular-nums',
                }}
            >
                <small>{id.toString()}</small>
            </p> */}

            {/* <MintButton
                id={id}
                onMint={() => {
                    console.log('mint');
                }}
            /> */}
        </div>
    );
};

export { FooterIconButtons };
