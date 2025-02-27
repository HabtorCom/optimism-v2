/*
Copyright 2021 OMG/BOBA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import WrongNetworkModal from 'containers/modals/wrongnetwork/WrongNetworkModal'
import networkService from 'services/networkService'

import { selectModalState } from 'selectors/uiSelector'

import {
  selectWalletMethod,
  selectNetwork,
} from 'selectors/setupSelector'

import { openModal } from 'actions/uiAction'
import { setWalletMethod } from 'actions/setupAction'
import { getAllNetworks } from 'util/masterConfig'

import { isChangingChain } from 'util/changeChain'
import * as S from "./WalletPicker.styles"
import { ReactComponent as Fox } from './../../images/icons/fox-icon.svg'
import { Container, Grid, useMediaQuery } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { styled } from '@material-ui/core/styles'
import { useTheme } from '@emotion/react'
import { enableBrowserWallet } from 'actions/networkAction'

require('dotenv').config()

const Root = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
}))

function WalletPicker ({ onEnable, enabled }) {

  const dispatch = useDispatch();

  const [walletEnabled, setWalletEnabled] = useState(false)
  const [accountsEnabled, setAccountsEnabled] = useState(false)
  const [wrongNetwork, setWrongNetwork] = useState(false)

  const walletMethod = useSelector(selectWalletMethod())
  const masterConfig = useSelector(selectNetwork())

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const wrongNetworkModalState = useSelector(selectModalState('wrongNetworkModal'))

  let maintenance = false

  if (process.env.REACT_APP_STATUS === 'maintenance' ) {
    maintenance = true
  }

  const dispatchSetWalletMethod = useCallback((methodName) => {
    dispatch(setWalletMethod(methodName));
  }, [ dispatch ])

  useEffect(() => {

    if (walletMethod === 'browser') {
      setupBrowserWallet()
    }

    async function setupBrowserWallet() {
      const selectedNetwork = masterConfig
      const walletEnabled = await dispatch(enableBrowserWallet(selectedNetwork))
      return walletEnabled
        ? setWalletEnabled(true)
        : dispatchSetWalletMethod(null);
    }

  }, [ dispatchSetWalletMethod, walletMethod, masterConfig , dispatch]);

  useEffect(() => {

    async function initializeAccounts () {

      const initialized = await networkService.initializeAccounts(masterConfig)

      if (!initialized) {
        console.log("Error !initialized for:",masterConfig)
        return setAccountsEnabled(false);
      }

      if (initialized === 'wrongnetwork') {
        setAccountsEnabled(false);
        return setWrongNetwork(true);
      }

      if (initialized === 'enabled') {
        return setAccountsEnabled(true)
      }

    }
    if (walletEnabled) {
      initializeAccounts()
    }
  }, [ walletEnabled, masterConfig ])

  useEffect(() => {
    if (accountsEnabled) {
      onEnable(true)
    }
  }, [ onEnable, accountsEnabled ])

  useEffect(() => {
    if (walletEnabled && wrongNetwork) {
      dispatch(openModal('wrongNetworkModal'));
      localStorage.setItem('changeChain', false)
    }
  }, [ dispatch, walletEnabled, wrongNetwork ])

  function resetSelection () {
    dispatchSetWalletMethod(null)
    setWalletEnabled(false)
    setAccountsEnabled(false)
  }

  // defines the set of possible networks
  const networks = getAllNetworks()

  let allNetworks = []
  for (var prop in networks) allNetworks.push(prop)

  if (!wrongNetwork && !enabled && isChangingChain) {
    return <S.Loading>Switching Chain...</S.Loading>
  }

  return (
    <>
      <WrongNetworkModal
        open={wrongNetworkModalState}
        onClose={resetSelection}
      />
      <Root>
        {!maintenance &&
          <Container maxWidth="md">
            <Grid container spacing={8}>
              <Grid item xs={12} md={6}>
                <Typography variant="h1" component="h1">
                  Connect a Wallet to access HABTOR
                </Typography>
                <S.Subtitle variant="body1" component="p" paragraph={true}>
                    Select a wallet to connect to HABTOR
                </S.Subtitle>
              </Grid>

              <Grid item xs={12} md={6}>
                <S.WalletCard
                  // disabled={!browserEnabled}
                  pulsate={true} onClick={()=>dispatchSetWalletMethod('browser')} isMobile={isMobile}>
                  <S.WalletCardHeading>
                    <S.WalletCardTitle>
                      <S.PlusIcon>+</S.PlusIcon>
                      <Typography variant="h2" component="h2" paragraph={true} mb={0}>
                        Metamask
                      </Typography>
                    </S.WalletCardTitle>
                    <Typography variant="body1" component="p" gutterBottom paragraph={true} mb={0}>
                      Connect using <strong>browser </strong>wallet
                    </Typography>
                  </S.WalletCardHeading>

                  <S.WalletCardDescription>
                    <Fox width={isMobile ? 100 : 50} />
                  </S.WalletCardDescription>
                </S.WalletCard>
              </Grid>
            </Grid>
          </Container>
       }
        {!!maintenance &&
          <Container maxWidth="md">
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>
                <Typography variant="h1" component="h1">
                  SCHEDULED HABTOR GATEWAY DOWNTIME
                </Typography>
                <S.Subtitle variant="body1" component="p" paragraph={true}>
                  As announced in Twitter and in Telegram, due to unexpectely high demand for the
                  Habtor L2, HABTOR liquidity pools are being rebalanced.
                </S.Subtitle>
                <S.Subtitle variant="body1" component="p" paragraph={true}>
                  The scheduled maintenance window is from Nov. 4 21:00 UTC to approximately 23:00 UTC.
                  Upgrade status and progress reports will be provided via Twitter and Telegram.
                </S.Subtitle>
              </Grid>
            </Grid>
          </Container>
        }
      </Root>
    </>
  );
}
export default React.memo(WalletPicker)
