import React, { Component } from 'react'
import ElectionContract from '../build/contracts/Election.json'
import Election from './Election.js'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract'

import MesaForm from './MesaForm.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

import Center from 'react-center'

//useful functions
//console.log(JSON.stringify(json, undefined, 2))
//this.state.web3.toAscii(x)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      depAddress: "",
      electionName: "",
      web3: null,
      addresses: []
    }
    this.updateMesas = this.updateMesas.bind(this)
  }
  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })
    }).catch(() => {
      console.log('Error finding web3.')
    })
  }

  //inicializa el factory del contrato election
  createElection(event) {
    event.preventDefault()
    const name = event.target.election.value
    const election = contract(ElectionContract)
    var electionInstance
    election.setProvider(this.state.web3.currentProvider)
    this.state.web3.eth.getAccounts((error, accounts) => {
      election.deployed().then((instance) => {
        // console.log(JSON.stringify(instance, undefined, 2))
        electionInstance = instance
        return electionInstance.setName(name, {from: accounts[0]})
      }).then((setResult) => {
        return electionInstance.getName.call(accounts[0])
      }).then((getResult) => {
        return this.setState({depAddress: electionInstance.address, electionName: getResult})
      })
    })
  }

  updateMesas(event) {
    event.preventDefault()
    const election = contract(ElectionContract)
    var electionInstance
    election.setProvider(this.state.web3.currentProvider)
    this.state.web3.eth.getAccounts((error, accounts) => {
      election.deployed().then((instance) => {
        electionInstance = instance
        return electionInstance.getMesas.call(accounts[0])
      }).then((mesas) => {
        return this.setState({addresses: mesas})
      })
    })
  }

  toLi(ls){
    return (<ul>
    {
      ls.map(x => {
        return (<li>{x}</li>)
      }
    )}
    </ul>)
  }

  render() {
    return (
      <Center>
      <div>
        <Election submitName={this.createElection.bind(this)}/>
        <p>
          Direccion de la eleccion:<br/>
          {this.state.depAddress}
        </p>
        <button type="button" onClick={this.updateMesas}>
          Ver direcciones de las mesas
        </button>
        {this.toLi(this.state.addresses)}
        <MesaForm/>
      </div>
      </Center>
    );
  }
}

export default App
