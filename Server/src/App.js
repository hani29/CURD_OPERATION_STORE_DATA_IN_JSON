import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import Modal from 'react-modal';
import BorderColorIcon from '@material-ui/icons/BorderColor';

const styles = theme => ({
  table: {
    minWidth: 650,
    padding: 0
  },
  paper: {
    maxWidth: 900,
    dispaly: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%'
  },
  heading: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 20,
    fontStyle: 'bold'
  }
});
const customStyles = {
  overlay: {
    zIndex: 1200,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 400,
    width: '100%'
  }
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      product: {
        sl: ' ',
        date: '',
        description: " ",
        income: '',
        amount: '',
        summary: ""
      },

      open: false,
      modalIsOpen: false,
      modalIsOpen2: false,
    }
  }

  componentDidMount() {
    this.getProducts();
    this.setState({ open: false })
  }


  //close modal
  closeModal2 = () => {
    this.setState({ modalIsOpen2: false });
  }
  
//function for post method 
  addproducts = () => {
    const { product } = this.state;
    axios.post(`http://localhost:3001/users`, product)
      .then(res => {
        this.getProducts()
      })
      .catch(err => console.error(err))
  }

  
//function to get data
  getProducts = () => {
    fetch('http://localhost:3001/users')
      .then(response => response.json())
      .then(response => {
        this.setState({ products: response, open: false })
      })

      .catch(err => console.error(err))
  }

//function to display delete data
  deleteCat = (e, data, index) => {
    let newdata = {
      data, index
    }
    this.setState({ open: newdata });
    e.stopPropagation();

  }
  getProducts = _ => {
    fetch('http://localhost:3001/users')
      .then(response => response.json())
      .then(response => {
        this.setState({ products: response })
      })

      .catch(err => console.error(err))
  }

  //function to delete data
  delete(e, data, index) {
    e.stopPropagation();
    axios.delete('http://localhost:3001/users/' + data.sl).then(res => {
      toast.success("Deleted successfully", {
        position: toast.POSITION.TOP_RIGHT
      });
      this.getProducts()
      let deldata = this.state.products;
      deldata.splice(index, -1);
      this.setState({ products: deldata, open: false });
    }).catch((error) => {
      toast.error("Sorry! couldn't Delete Category", {
        position: toast.POSITION.TOP_RIGHT
      });

    })
  }

  //function to open modal
  openModal2(e, data, index) {
    let renamedata = {
      e, data, index
    }
    this.setState({ modalIsOpen2: renamedata, modelindex: true, rename_date: data.date, rename_description: data.description, rename_income: data.income, rename_amount: data.amount, rename_summary: data.summary });
    e.stopPropagation();
  }

  //function to update data
  rename = (data) => {
    const { rename_date, rename_description, rename_income, rename_amount, rename_summary } = this.state
    let dataImage = {
      "sl": data.data.sl,
      "date": rename_date,
      "description": rename_description,
      "income": rename_income,
      "amount": rename_amount,
      "summary": rename_summary
    }
    axios.put('http://localhost:3001/users/' + data.data.sl).then(res => {
      toast.success("Rename successfully", {
        position: toast.POSITION.TOP_RIGHT
      });
      let newarr = this.state.products;
      newarr[data.index].sl = dataImage.sl;
      newarr[data.index].date = dataImage.date;
      newarr[data.index].description = dataImage.description;
      newarr[data.index].income = dataImage.income;
      newarr[data.index].amount = dataImage.amount;
      newarr[data.index].summary = dataImage.summary;

      this.setState({ prducts: newarr });
      this.closeModal2();
    }).catch((error) => {
      toast.error("Sorry! couldn't Rename Category", {
        position: toast.POSITION.TOP_RIGHT
      })
    })
  }

  render() {
    const { products, product, open, product_id, name_data, price_data, rename_date, rename_description, rename_income, rename_amount, rename_summary } = this.state
    const { classes } = this.props
    return (
      <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
        <Grid item xs={12}>
          <TableContainer component={Paper} className={classes.paper}>
            <Table className={classes.table}>
              <TableHead style={{ backgroundColor: '#e68888', color: '#fff', textTransform: 'capitalize' }}>
                <TableRow  >
                  <TableCell className={classes.heading} align="center">sl.no</TableCell>
                  <TableCell className={classes.heading} align="center">data</TableCell>
                  <TableCell className={classes.heading} align="center">amount</TableCell>
                  <TableCell className={classes.heading} align="center">income</TableCell>
                  <TableCell className={classes.heading} align="center">summary</TableCell>
                  <TableCell className={classes.heading} align="center">description</TableCell>
                  <TableCell className={classes.heading} align="center">delete</TableCell>
                  <TableCell className={classes.heading} align="center">update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {Object.values(products).map((claim, index) => {
                  return (
                    <TableRow style={{ cursor: 'pointer' }} onClick={(e) => this.openModal(e, claim, index)}>
                      <TableCell align="center" style={{ textTransform: 'capitalize' }}> {claim.sl}</TableCell>
                      <TableCell align="center"> {claim.date}</TableCell>
                      <TableCell align="center"> {claim.amount}</TableCell>
                      <TableCell align="center"> {claim.income} {claim.expense}</TableCell>
                      <TableCell align="center" style={{ textTransform: 'capitalize' }}> {claim.summary}</TableCell>
                      <TableCell align="center" style={{ textTransform: 'capitalize' }}> {claim.description}</TableCell>
                      <TableCell align="center"><DeleteIcon style={{ boxshadow: 'none', color: '#f73434', fontStyle: 'bold', cursor: 'pointer' }} onClick={(e) => this.delete(e, claim, index)} /></TableCell>
                      <TableCell align="center"><BorderColorIcon style={{ boxshadow: 'none', color: '#a07c7c', fontStyle: 'bold', cursor: 'pointer' }} onClick={(e) => this.openModal2(e, claim, index)} /></TableCell>
                    </TableRow>
                  )

                })}

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Enter Date" variant="outlined" value={product.date} onChange={e => this.setState({ product: { ...product, date: e.target.value } })} />
        </Grid>
        <Grid item xs={12}>
          <TextField style={{ marginRight: 15 }} label="Enter Amount" variant="outlined" value={product.amount} onChange={e => this.setState({ product: { ...product, amount: e.target.value } })} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Enter income" variant="outlined" value={product.income} onChange={e => this.setState({ product: { ...product, income: e.target.value } })} />
        </Grid>
        <Grid item xs={12}>
          <TextField style={{ marginRight: 15 }} label="Enter summary" variant="outlined" value={product.summary} onChange={e => this.setState({ product: { ...product, summary: e.target.value } })} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Enter Description" variant="outlined" value={product.description} onChange={e => this.setState({ product: { ...product, description: e.target.value } })} />
        </Grid>
        <Grid item xs={12} style={{ marginTop: -10 }}>
          <Button style={{ backgroundColor: 'green', boxShadow: 'none', color: 'white', fontStyle: 'bold' }} onClick={this.addproducts}>Add Details</Button>

        </Grid>



        <Modal
          isOpen={this.state.modalIsOpen2}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal2}
          style={customStyles}
        >

          <div style={{ backgroundColor: '#fff', padding: 5 }}>
            <div >
              <Typography variant="h6">Rename</Typography>
              <TextField
                id="outlined-full-width"
                className="nounderline"
                style={{ width: '100%', border: '1px solid darkgrey', height: 33, borderRadius: '5px', display: 'flex', position: 'relative', marginTop: 15, paddingLeft: 8, paddingRight: 8 }}
                fullWidth
                multiline
                rows="1"
                placeholder="Date"
                value={rename_date}
                onChange={(e) => this.setState({ rename_date: e.target.value })}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="outlined-full-width"
                className="nounderline"
                style={{ width: '100%', border: '1px solid darkgrey', height: 33, borderRadius: '5px', display: 'flex', position: 'relative', marginTop: 15, paddingLeft: 8, paddingRight: 8 }}
                fullWidth
                multiline
                rows="1"
                placeholder="Description"
                value={rename_description}
                onChange={(e) => this.setState({ rename_description: e.target.value })}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="outlined-full-width"
                className="nounderline"
                style={{ width: '100%', border: '1px solid darkgrey', height: 33, borderRadius: '5px', display: 'flex', position: 'relative', marginTop: 15, paddingLeft: 8, paddingRight: 8 }}
                fullWidth
                multiline
                rows="1"
                placeholder="Income"
                value={rename_income}
                onChange={(e) => this.setState({ rename_income: e.target.value })}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="outlined-full-width"
                className="nounderline"
                style={{ width: '100%', border: '1px solid darkgrey', height: 33, borderRadius: '5px', display: 'flex', position: 'relative', marginTop: 15, paddingLeft: 8, paddingRight: 8 }}
                fullWidth
                multiline
                rows="1"
                placeholder="Amount"
                value={rename_amount}
                onChange={(e) => this.setState({ rename_amount: e.target.value })}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="outlined-full-width"
                className="nounderline"
                style={{ width: '100%', border: '1px solid darkgrey', height: 33, borderRadius: '5px', display: 'flex', position: 'relative', marginTop: 15, paddingLeft: 8, paddingRight: 8 }}
                fullWidth
                multiline
                rows="1"
                placeholder="Summary"
                value={rename_summary}
                onChange={(e) => this.setState({ rename_summary: e.target.value })}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 26, justifyContent: 'right' }}>
                <div style={{ marginRight: 15, marginLeft: 'auto' }}>
                  <Button onClick={this.closeModal2} variant='outlined' style={{ fontWeight: 400, maxWidth: 99, width: '100%', height: 39, textTransform: 'capitalize' }}>Cancel</Button>
                </div>
                <div>
                  <Button onClick={() => this.rename(this.state.modalIsOpen2)} variant='outlined' style={{ fontWeight: 400, maxWidth: 99, width: '100%', height: 39, color: '#fff', backgroundColor: '#000', textTransform: 'capitalize' }}>Rename</Button>
                </div>
              </div>
            </div>

          </div>

        </Modal>
      </Grid>

    );


  }

}

export default withStyles(styles)(App);







