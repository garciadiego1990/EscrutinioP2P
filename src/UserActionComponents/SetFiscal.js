/**
 * React utilities
 */
import React, { Component } from 'react'
import { Button, Header, Form, Confirm, Loader } from 'semantic-ui-react'
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

class SetFiscal extends Component {
    constructor() {
        super()
        this.state = {
          email : "",
          candidato : "",
          distrito : "",
          escuela : "",
          mesa : "",
          mesas : [],
          distritos : [],
          escuelas : [],
          open : false,
          loadingEscuelas : false,
          loadingMesas : false,
        }
    }
    componentWillMount(){
      api.getDistritos().then(resDistritos => {
        this.setState({
          distritos : resDistritos.data.map((x, idX) => {return { key : idX, value : x, text : x}})
        })
      }).catch(error => {
        console.log(error.response)
      })
      api.getCandidateForApoderado(currentUser.getEmail(cookie))
      .then( result => {
        this.setState({
          candidato : result.data
        })
      })
      .catch( error => {
        console.log(error.response)
      })
    }

    handleSetFiscal(event) {
      event.preventDefault()
      api.setFiscal(currentUser.getEmail(cookie), this.state.candidato, this.state.email, this.state.distrito, this.state.escuela, this.state.mesa)
      .then(res => {
        utils.showSuccess(this.msg, res.data)
        this.setState({email : "", distrito : "", escuela : "", mesa : "", escuelas : [], mesas : []})
      })
      .catch(error => {
        utils.showError(this.msg, error.response.data)
        this.setState({email : ""})
      })
      this.setState({open : false})
    }

    handleFiscal = (event) => { this.setState({ email : event.target.value }) }
    handleCandidato = (event) => { this.setState({ candidato : event.target.value }) }
    handleDistrito = (event, {value}) => {
      api.getEscuelas(value).then(res => {
        this.setState({
          distrito : value,
          escuelas : res.data.map((x, idX) => {
            return { key : idX, value : x, text : x}
          }),
          loadingEscuelas : false
        })
      }).catch(error => {
        this.setState({loadingEscuelas : false})
      })
      this.setState({loadingEscuelas : true, escuelas : [], mesas : []})
    }
    handleEscuela = (event, {value}) => {
      api.getMesas(this.state.distrito, value).then(res => {
        this.setState({
          escuela : value ,
          mesas : res.data.map((x, idX) => {
            return { key : idX, value : x, text : x}
          }),
          loadingMesas : false
        })
      }).catch(error => {
        this.setState({loadingMesas : false})
      })
      this.setState({loadingMesas : true, mesas : []})
    }
    handleMesa = (event, {value}) => { this.setState({ mesa : value }) }
    show = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    // {this.state.escuelas.length !== 0 ? this.renderEscuelas() : (this.state.loadingEscuelas ? <Loader active inline='centered'/> : null)}
    renderEscuelas(){
      if(this.state.escuelas.length === 0){
        if(this.state.loadingEscuelas){
          return (<Loader active inline='centered'/>)
        } else {
          return null
        }
      } else {
        return (
          <Form.Dropdown
            required
            label='ID de la Escuela'
            placeholder='Escuela'
            options={this.state.escuelas}
            selection
            onChange={this.handleEscuela.bind(this)}
            />
          )
      }
    }
    // {this.state.mesas.length !== 0 ? this.renderMesas() : (this.state.loadingMesas ? <Loader active inline='centered'/> : null)}
    renderMesas(){
      if(this.state.mesas.length === 0){
        if(this.state.loadingMesas){
          return (<Loader active inline='centered'/>)
        } else {
          return null
        }
      } else {
        return (
          <Form.Dropdown
            required
            label='ID de la Mesa'
            placeholder='Mesa'
            options={this.state.mesas}
            selection
            onChange={this.handleMesa.bind(this)}
          />
        )
      }
    }

    render () {
        return (
            <div>
              <AlertContainer ref={a => this.msg = a} {...utils.alertConfig()} />

              <Header as='h2' textAlign='center'>
                Asignar Fiscal
                <Header.Subheader>
                  A la lista: {this.state.candidato}
                </Header.Subheader>
              </Header>

              <Form>
                  <Form.Input
                      required
                      type="email"
                      label='Correo del Fiscal'
                      placeholder='Correo del Fiscal'
                      value={this.state.email}
                      onChange={this.handleFiscal.bind(this)}
                  />
                  <Form.Dropdown
                    required
                    label='ID del Distrito'
                    placeholder='Distrito'
                    options={this.state.distritos}
                    selection
                    value={this.state.distrito}
                    onChange={this.handleDistrito.bind(this)}
                  />
                  {this.renderEscuelas()}
                  {this.renderMesas()}
                  <Button basic color="green" disabled={this.state.email.length === 0 || this.state.candidato.length === 0 || this.state.distrito.length === 0 || this.state.escuela.length === 0 || this.state.mesa.length === 0} onClick={this.show.bind(this)}>Asignar</Button>
                  <Confirm
                    open={this.state.open}
                    header='Asignación de Fiscal de Mesa'
                    content={`Estas seguro de asignar al usuario: ${this.state.email}, como fiscal de la mesa:  ${this.state.mesa} de la escuela: ${this.state.escuela} del distrito: ${this.state.distrito}, para el candidato: ${this.state.candidato}`}
                    onCancel={this.close.bind(this)}
                    onConfirm={this.handleSetFiscal.bind(this)}
                  />
              </Form>
            </div>
        );
    }
}

export default SetFiscal
