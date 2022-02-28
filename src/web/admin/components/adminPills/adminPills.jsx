
import React from 'react'
import { Translate } from "react-i18nify"
import { Button } from '@chakra-ui/react'

import './adminPills.css'


class adminPills extends React.Component {
    render() {
        return <div className="adminPills">
            {this.props.admins.map((admin) => {     
               return (
                  <div className="adminPill">
                       <p>${this.props.adminName}</p>
                  </div>
               ) 
            })}
        </div>
    }
}
