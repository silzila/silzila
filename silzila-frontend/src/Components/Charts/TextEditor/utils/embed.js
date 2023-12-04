import { Transforms} from 'slate';

import {createParagraph} from './paragraph'
export const createImageNode = (alt,{url,width,height}) =>({
    type:"image",
    alt,
    url,
    width,
    height,
    children: [{text:""}]
});
export const createVideoNode = ({url,width,height})=>({
    type:'video',
    url,
    width,
    height,
    children:[{text:""}]
})

export const insertEmbed = (editor,embedData,format) => {
    const {url,width,height} = embedData;
    if(!url) return;
    embedData.width = width ?`${width}px` : '100%';
    embedData.height = height ? `${height}px`:'auto'
    const embed = format === 'image' ?  createImageNode("EditorImage",embedData):createVideoNode(embedData);
    
    //console.log(format);
    Transforms.insertNodes(editor,embed,{select:true});
    Transforms.insertNodes(editor,createParagraph(""),{mode:'highest'})
}