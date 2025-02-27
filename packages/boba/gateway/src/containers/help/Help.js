import React from 'react'
import { connect } from 'react-redux'
import { Grid, Link, Typography } from '@material-ui/core'
import PageHeader from 'components/pageHeader/PageHeader'

class Help extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
    }

  }

  componentDidMount() {

  }

  componentDidUpdate(prevState) {

  }

  render() {

    return (
      <>
        <PageHeader title="HELP/FAQ" />

        <Grid item xs={12}>
        
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{fontWeight: "700", paddingBottom: '20px'}}
          >
            Common Questions
          </Typography>

          <Typography variant="body1" component="p" sx={{mt: 2, mb: 0, fontWeight: '700'}}>
            MetaMask does not pop up
          </Typography>
          <Typography variant="body2" component="p" sx={{mt: 0, mb: 0, lineHeight: '1.0em', opacity: '0.7'}}>
            Some third party popup blockers, such as uBlock Origin, can interfere with MetaMask. 
            If MetaMask is not popping up, try disabling 3rd party popup blockers.
          </Typography>

          <Typography variant="body1" component="p" sx={{mt: 2, mb: 0, fontWeight: '700'}}>
            Ledger Hardware Wallet Random Errors
          </Typography>
          <Typography variant="body2" component="p" sx={{mt: 0, mb: 0, lineHeight: '1.0em', opacity: '0.7'}}>
            UNKNOWN_ERROR (0x650f) when trying to connect to MetaMask. Solution: on the Ledger, select 'ethereum' and 
            make sure the display says 'Application is ready'.
          </Typography>

          <Typography variant="body1" component="p" sx={{mt: 2, mb: 0, fontWeight: '700'}}>
            Ledger Hardware Wallet L1 to L2 Deposits not working
          </Typography>
          <Typography variant="body2" component="p" sx={{mt: 0, mb: 0, lineHeight: '1.0em', opacity: '0.7'}}>
            Please make sure that you are using a current firmware version for Ledger, for example, v2.1.0.
          </Typography>

          <Typography variant="body1" component="p" sx={{mt: 2, mb: 0, fontWeight: '700'}}>
            MetaMask / Ledger Blind Signing
          </Typography>
          <Typography variant="body2" component="p" sx={{mt: 0, mb: 0, lineHeight: '1.0em', opacity: '0.7'}}>
            Please follow the MetaMask instructions above the 'Confirm' button in MetaMask - 'blind signing' must be enabled in 
            the Ethereum app in Ledger (ethereum>settings>blind signing)
          </Typography>

          <Typography variant="body1" component="p" sx={{mt: 2, mb: 0, fontWeight: '700'}}>
            L1 to L2 Deposits not working
          </Typography>
          <Typography variant="body2" component="p" sx={{mt: 0, mb: 0, lineHeight: '1.0em', opacity: '0.7'}}>
            Please make sure that you are using a current version of MetaMask, for example, 10.1.0.
          </Typography>

          <Typography variant="body1" component="p" sx={{mt: 2, mb: 0, fontWeight: '700'}}>
            Transactions failing silently?
          </Typography>
          <Typography variant="body2" component="p" sx={{mt: 0, mb: 0, lineHeight: '1.0em', opacity: '0.7'}}>
            Please use your browser's developer console to see the error message and then please check the project's{' '}
            <Link variant="body2" style={{lineHeight: '1.0em', fontWeight: '700'}} href='https://github.com/omgnetwork/optimism-v2/issues'>GitHub issues list</Link>{' '}  
            to see if other people have had the same problem. If not, please file a new GitHub issue.
          </Typography>

          <Typography variant="body1" component="p" sx={{mt: 2, mb: 0, fontWeight: '700'}}>
            DAO not active yet
          </Typography>
          <Typography variant="body2" component="p" sx={{mt: 0, mb: 0, lineHeight: '1.0em', opacity: '0.7'}}>
            The DAO is pending and is not yet live.
          </Typography>

          <Typography variant="body1" component="p" sx={{mt: 2, mb: 0, fontWeight: '700'}}>
            It would be really nice if...
          </Typography>
          <Typography variant="body2" component="p" sx={{mt: 0, mb: 0, lineHeight: '1.0em', opacity: '0.7'}}>
            We love hearing about new features that you would like. Please file suggestions, 
            prefaced with `Gateway Feature`, in our{' '}
            <Link variant="body2" style={{lineHeight: '1.0em', fontWeight: '700'}} href='https://github.com/omgnetwork/optimism-v2/issues'>GitHub issues list</Link>.  
            Expect a turnaround time of several days for us to be able to consider new UI/GateWay features. 
            Keep in mind that this is an opensource project, so help out, $ git clone, $ yarn, $ yarn start, and then open a PR.
          </Typography>
        
        </Grid>

      </>
    )
  }
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(Help)
