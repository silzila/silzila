import { insertLink } from '../../utils/link.js'
import Button from '../../common/Button'
import Icon from '../../common/Icon'
import {isBlockActive} from '../../utils/SlateUtilityFunctions.js'
const LinkButton = (props)=>{
    const {editor} = props
    const handleInsertLink = ()=>{
        const url = prompt('Enter URL');
        insertLink(editor,url)
    }
    return (
        <Button active={isBlockActive(editor,'link')} format={'link'} onClick={handleInsertLink}>
            <Icon icon='link'/>
        </Button>
    )
}


export default LinkButton;