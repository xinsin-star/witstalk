import { useState } from "react";
import ChannelTree, { type Channel } from "~/components/ChannelTree";

export default function File() {
    const [treeData, setTreeData] = useState<Channel | null>(null);
    
    const treeSelect = (nodeData: Channel) => {
        delete nodeData.children;
        setTreeData(nodeData);
    }

    return (
        <div style={{ display: 'flex' }}>
            <div>
                <ChannelTree onSelect={treeSelect}/>
            </div>
            <div>

            </div>
        </div>
    )
}