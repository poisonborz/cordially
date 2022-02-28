
import React from 'react'
import { Translate } from "react-i18nify"
import { Button } from '@chakra-ui/react'

import './section.css'


class section extends React.Component {
    render() {
        return <div className="section">
            <Translate value={`items.${this.props.item}.plural`} />
            <Button colorScheme='gray' size='sm'>
                <Translate value={`items.${this.props.item}.new`} />
            </Button>
        </div>
    }
}
