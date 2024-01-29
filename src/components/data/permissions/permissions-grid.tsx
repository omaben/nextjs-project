import GridStyle from '@/components/custom/GridStyle';
import PortalCopyValue from '@/components/custom/PortalCopyValue';
import { User, UserPermission } from '@alienbackoffice/back-front';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import {
   DataGridPro,
   GridColDef,
   GridColumnVisibilityModel,
   GridSortModel,
} from '@mui/x-data-grid-pro';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthCurrentRoleName, selectAuthRoles } from 'redux/authSlice';
import {
   CustomMenuSortAscendingIcon,
   CustomMenuSortDescendingIcon,
   CustomMenuSortIcon,
   CustomNoRowsOverlay,
   PageWithdetails4ToolbarWithButton,
} from 'services/globalFunctions';
import { roleNameText } from 'types';
import { useGetPermissionsListQuery } from './hooks/queries';

export default function PermissionsData(data: {
   user: User;
   userPermissionEventInit: [];
   setPermissionEdit: Function;
}) {
   const [permissionData, setPermissionData]: any = React.useState(
      data?.user?.permissions
   );
   const theme = useTheme();
   const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
   const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
   const roles = useSelector(selectAuthRoles);
   const roleName = useSelector(selectAuthCurrentRoleName) as string;
   const [paginationModel, setPaginationModel] = React.useState({
      pageSize: 50,
      page: 0,
   });
   const [dataSort, setDataSort]: any = React.useState({
      updatedAt: -1,
   });

   const columns: GridColDef[] = [
      {
         field: 'title',
         headerName: 'Title',
         renderCell: (params) => <PortalCopyValue value={params.value} />,
         minWidth: 250,
         hideable: false,
         flex: 1,
         sortable: false,
      },
      {
         field: 'description',
         headerName: 'Description',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'tags',
         headerName: 'Tags',
         renderCell: (params) => params.value,
         minWidth: 100,
         flex: 1,
         sortable: false,
      },
      {
         field: 'event',
         headerName: 'Event',
         renderCell: (params) => <PortalCopyValue value={params.value} />,
         minWidth: 250,
         hideable: false,
         flex: 1,
         sortable: false,
      },
   ];

   const [rowCountState, setRowCountState] = React.useState(
      data.userPermissionEventInit?.length || 0
   );

   const [columnVisibilityModel, setColumnVisibilityModel] =
      React.useState<GridColumnVisibilityModel>({});

   useGetPermissionsListQuery({});

   const handleSortModelChange = React.useCallback(
      (sortModel: GridSortModel) => {
         const fieldName = sortModel[0].field;
         let data = {};
         fieldName === 'gameId'
            ? (data = {
                 title: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : fieldName === 'createdAt'
            ? (data = {
                 createdAt: sortModel[0].sort === 'asc' ? 1 : -1,
              })
            : (data = {
                 updatedAt: sortModel[0].sort === 'asc' ? 1 : -1,
              });
         setDataSort(data);
      },
      []
   );

   React.useEffect(() => {
      setRowCountState((prevRowCountState: any) =>
         data.userPermissionEventInit?.length !== undefined
            ? data.userPermissionEventInit?.length
            : prevRowCountState
      );
   }, [data.userPermissionEventInit.length, setRowCountState]);

   React.useEffect(() => {
      if (roleName === roleNameText.CURRENTUSEDROLE) {
         setPermissionData(data.user.permissions);
      } else {
         setPermissionData(
            (roles?.length > 0 &&
               roles.find((item) => item.name === roleName)
                  ?.UserPermissionEvent) ||
               []
         );
      }
   }, [roleName]);

   return (
      <Box
         className="dataGridWrapper"
         mb={'0px'}
         px={isLgUp ? '12px' : '4px'}
         py={'0'}
         sx={{
            height: PageWithdetails4ToolbarWithButton,
            width: isDesktop ? 'calc(100vw - 225px)' : '100%',
         }}
      >
         <DataGridPro
            disableVirtualization
            checkboxSelection={true}
            rowHeight={isDesktop ? 44 : 30}
            sx={GridStyle}
            getRowId={(row) => row.event}
            rows={data.userPermissionEventInit || []}
            paginationMode="server"
            sortingMode="server"
            rowCount={rowCountState | 0}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortingOrder={['desc', 'asc']}
            rowSelectionModel={permissionData}
            onSortModelChange={handleSortModelChange}
            onRowSelectionModelChange={(newSelectionModel) => {
               const dataItem = data.userPermissionEventInit.map(
                  (item: any) => item.event
               );
               const lastData =
                  permissionData?.filter(
                     (item: any) =>
                        !dataItem.includes(item) &&
                        !newSelectionModel.includes(item)
                  ) || [];
               data.setPermissionEdit([...lastData, ...newSelectionModel]);
               setPermissionData([...lastData, ...newSelectionModel]);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
               setColumnVisibilityModel(newModel)
            }
            getRowClassName={(params) =>
               params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            disableColumnMenu
            slots={{
               noRowsOverlay: CustomNoRowsOverlay,
               noResultsOverlay: CustomNoRowsOverlay,
               columnSortedAscendingIcon: CustomMenuSortAscendingIcon,
               columnSortedDescendingIcon: CustomMenuSortDescendingIcon,
               columnUnsortedIcon: CustomMenuSortIcon,
            }}
         />
      </Box>
   );
}
