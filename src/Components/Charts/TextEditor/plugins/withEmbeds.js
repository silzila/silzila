const withEmbeds = (editor) =>{
    
    const { isVoid } = editor;

    editor.isVoid = (element) => 
        ['video','image'].includes(element.type) ? true : isVoid(element);
    return editor;
}


export default withEmbeds