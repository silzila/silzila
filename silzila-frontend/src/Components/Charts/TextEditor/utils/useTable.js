import { useEffect, useState } from 'react';
import { Editor, Element } from 'slate'


const useTable = (editor)=>{
    const [isTable,setIsTable] = useState(false);
    useEffect(()=>{
        if(editor.selection){
            const [tableNode] = Editor.nodes(editor,{
                match:n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table'
            })
            
            setIsTable(!!tableNode);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[editor.selection])

    return isTable;
}

export default useTable;