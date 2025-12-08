import ChannelTree from "~/components/ChannelTree";

export default function Channel() {
    return (
        <div style={{
            display: 'flex'
        }}>
            <div>
                <ChannelTree/>
            </div>
            <div style={{
                height: '84vh',
                width: '78vw',
                margin: '10px',
                overflow: 'auto',
                backgroundColor: 'var(--cream-bg-2)',
                borderRadius: '10px',
                padding: '3px'
            }}>
                adsa
            </div>
        </div>
    );
}
