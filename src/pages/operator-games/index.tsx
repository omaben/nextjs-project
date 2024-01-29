import CustomLoader from '@/components/custom/CustomLoader';
import CustomOperatorsBrandsToolbar from '@/components/custom/customOperatorsBrandsToolbar';
import { useSetGameOperatorStatusMutation } from '@/components/data/operatorGames/lib/hooks/queries';
import OperatorGames from '@/components/data/operatorGames/operator-games-grid';
import {
   GameStatus,
   SetOperatorGamesStatusDto,
   UserPermissionEvent,
} from '@alienbackoffice/back-front';
import styled from '@emotion/styled';
import { Grid, Button as MuiButton, useTheme } from '@mui/material';
import { spacing } from '@mui/system';
import { darkPurple } from 'colors';
import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { selectAuthOperator } from 'redux/authSlice';
import { hasDetailsPermission } from 'services/permissionHandler';
import DashboardLayout from '../../layouts/Dashboard';

const Button = styled(MuiButton)(spacing);

function OpGames() {
   const theme = useTheme();
   const opId = useSelector(selectAuthOperator);
   const [gamesSelected, setGameSelected] = React.useState([]);
   const [ignore, setIgnore] = React.useState(false);

   const { mutate: mutateStatus } = useSetGameOperatorStatusMutation({
      onSuccess: () => {},
   });

   const handleSubmitGameStatus = React.useCallback(
      (dto: SetOperatorGamesStatusDto) => {
         mutateStatus({ dto });
      },
      [mutateStatus]
   );

   const updateGrid = (data: any) => {
      setGameSelected(data);
   };

   useEffect(() => {
      if (!ignore) {
         setTimeout(() => {
            setIgnore(true);
         }, 500);
      }
   });

   return (
      <React.Fragment>
         <Helmet title="iMoon | Operator Games" />
         <CustomOperatorsBrandsToolbar
            title={`Game List`}
            background={theme.palette.secondary.dark}
            sx={{
               mb: '0',
            }}
            actions={
               <>
                  {gamesSelected.length > 0 &&
                     hasDetailsPermission(
                        UserPermissionEvent.BACKOFFICE_OPERATOR_SET_GAMES_STATUS_REQ
                     ) && (
                        <>
                           <Grid item>
                              <Button
                                 color="info"
                                 variant="contained"
                                 onClick={() =>
                                    handleSubmitGameStatus({
                                       opId: opId,
                                       gameStatus: GameStatus.ACTIVE,
                                       gameIds: gamesSelected,
                                    })
                                 }
                                 sx={{
                                    borderRadius: '8px',
                                    '&:hover': {
                                       background: '#8098F9',
                                    },
                                    padding: '4px 8px',
                                    letterSpacing: '0.48px',
                                    gap: '2px',
                                    height: '28px',
                                 }}
                              >
                                 {' '}
                                 Enable
                              </Button>
                           </Grid>
                           <Grid item>
                              <Button
                                 color="secondary"
                                 variant="outlined"
                                 sx={{
                                    color: darkPurple[10],
                                    borderColor: darkPurple[10],
                                    padding: '4px 8px',
                                    letterSpacing: '0.48px',
                                    gap: '2px',
                                    height: '28px',
                                 }}
                                 onClick={() =>
                                    handleSubmitGameStatus({
                                       opId: opId,
                                       gameStatus: GameStatus.DISABLED,
                                       gameIds: gamesSelected,
                                    })
                                 }
                              >
                                 {' '}
                                 Disable
                              </Button>
                           </Grid>
                        </>
                     )}
               </>
            }
         />
         {ignore ? (
            <OperatorGames opId={opId} updateGrid={updateGrid} />
         ) : (
            <CustomLoader />
         )}
      </React.Fragment>
   );
}

OpGames.getLayout = function getLayout(page: ReactElement) {
   return <DashboardLayout title="Operator Games List">{page}</DashboardLayout>;
};

export default OpGames;
