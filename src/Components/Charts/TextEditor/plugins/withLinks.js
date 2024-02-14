const withLinks = (editor)=>{

    const { isInline } = editor;
    editor.isInline = (element) => 
        element.type === 'link' ? true :isInline(element);
    return editor;
};

export default withLinks;