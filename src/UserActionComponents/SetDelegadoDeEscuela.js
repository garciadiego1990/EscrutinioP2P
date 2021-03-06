/**
 * React utilities
 */
import React, { Component } from 'react'
import { Button, Form, Confirm, Header } from 'semantic-ui-react'
// import Center from 'react-center'

/**
 * Components
 */
// import ComponentTitle from '../utils/ComponentTitle.js'

/**
 * Controller for Component
 */
import AlertContainer from 'react-alert'
import * as utils from '../utils/utils.js'
import * as currentUser from '../utils/user_session.js'
import * as api from '../utils/api-call.js'
import cookie from 'react-cookies'

class SetDelegadoDeEscuela extends Component {
    constructor() {
        super()
        this.state = {
            correoDelegado : "",
            escuela : "",
            escuelas : [],
            open : false
        }
        this.distrito = currentUser.getDistrito(cookie)
    }
    componentWillMount(){
      api.getEscuelas(currentUser.getDistrito(cookie)).then(res => {
        this.setState({escuelas : res.data.map((x, idX) => {return {key : idX, value : x, text : x}})})
      }).catch(error => {
        console.log(error)
      })
    }
    handleSetDelegadoDeEscuela(event) {
      event.preventDefault()
      api.setDelegadoDeEscuela(currentUser.getEmail(cookie), this.state.correoDelegado, this.distrito, this.state.escuela)
      .then(res => {
        utils.showSuccess(this.msg, res.data)
      })
      .catch(error => {
        utils.showError(this.msg, error.response.data)
      })
      this.setState({open : false, correoDelegado : "", escuela : ""})
    }
    handleDelegadoEscuela = (event) => { this.setState({ correoDelegado : event.target.value }) }
    handleEscuela = (event, {value}) => { this.setState({ escuela : value }) }
    show = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    render () {
        return (
            <div>
              <AlertContainer ref={a => this.msg = a} {...utils.alertConfig()} />
              <Header as='h2' textAlign='center'>
                Asignar Delegado de Escuela
                <Header.Subheader>
                  Al distrito: {this.distrito}
                </Header.Subheader>
              </Header>
              <Form>
                  <Form.Input
                      required
                      type="email"
                      label='Delegado'
                      placeholder='Correo del Delegado'
                      value={this.state.correoDelegado}
                      onChange={this.handleDelegadoEscuela.bind(this)}
                  />
                  <Form.Dropdown
                    required
                    label='ID de la Escuela'
                    placeholder='Escuela'
                    options={this.state.escuelas}
                    selection
                    value={this.state.escuela}
                    onChange={this.handleEscuela.bind(this)}
                  />
                  <Button basic color="green" disabled={this.state.correoDelegado.length === 0 || this.state.escuela.length === 0} onClick={this.show.bind(this)}>Asignar</Button>
                  <Confirm
                    open={this.state.open}
                    header='Asignación de Delegado de Escuela'
                    content={`Estas seguro de asignar al usuario: ${this.state.correoDelegado}, como delegado de la escuela: ${this.state.escuela} del distrito: ${this.distrito}`}
                    onCancel={this.close.bind(this)}
                    onConfirm={this.handleSetDelegadoDeEscuela.bind(this)}
                  />
              </Form>
            </div>
        );
    }
}

export default SetDelegadoDeEscuela
// <Form.Field
//   control='input'
//   min={1}
//   required
//   type='number'
//   label='ID de la Escuela'
//   placeholder='ID de la Escuela'
//   value={this.state.escuela}
//   onChange={this.handleEscuela.bind(this)}
// />
