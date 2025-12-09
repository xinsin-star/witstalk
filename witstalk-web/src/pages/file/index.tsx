import { useState } from "react";
import ChannelTree, { type Channel } from "~/components/ChannelTree";

export default function File() {
    const [treeData, setTreeData] = useState<Channel | null>(null);
    
    const treeSelect = (nodeData: Channel) => {
        delete nodeData.children;
        setTreeData(nodeData);
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div>
                <ChannelTree onSelect={treeSelect}/>
            </div>
            <div style={{ flex: 1, margin: '10px', padding: '16px', backgroundColor: 'var(--cream-bg-2)', borderRadius: 'var(--cream-border-radius)' }}>
                {treeData ? (
                    <div>
                        <h3>选中的频道信息</h3>
                        <p>频道名称: {treeData.channelName}</p>
                        <p>频道编码: {treeData.channelCode}</p>
                        <p>频道描述: {treeData.channelDesc}</p>
                    </div>
                ) : (
                    <div>请选择一个频道</div>
                )}
            </div>
        </div>
    )
}