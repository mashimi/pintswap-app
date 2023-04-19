import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { muiCache, muiOptions, muiTheme } from '../utils/mui';
import MUIDataTable, { MUIDataTableColumnDef } from 'mui-datatables';
import { SpinnerLoader } from './spinner-loader';
import { useWindowSize } from '../hooks/window-size';
import { useNavigate } from 'react-router-dom';

type IDataTableProps = {
  title: string;
  data: (object | number[] | string[])[];
  columns: MUIDataTableColumnDef[];
  loading?: boolean;
  type: 'explore' | 'pairs' | 'peers' | 'orderbook'
}

export const DataTable = ({ title, data, columns, loading, type }: IDataTableProps) => {
  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={muiTheme()}>
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={{
            ...muiOptions,
            textLabels: {
              body: {
                  noMatch: loading ? (
                      <SpinnerLoader />
                  ) : (
                      'Error occured while fetching data. Please refresh the page.'
                  ),
              },
            },
            customRowRender: (data, dataIndex, rowIndex) => (
              <CustomRow 
                key={`data-table-row-${rowIndex}`} 
                props={data} 
                columns={columns.map((col: any) => col.label)} 
                loading={loading}
                type={type}
              />
            )
          }}
        />
      </ThemeProvider>
    </CacheProvider>
  )
}

type IDataTableRowProps = {
  columns: string[]
  props: object;
  loading?: boolean;
  type: 'explore' | 'pairs' | 'peers' | 'orderbook'
}

const CustomRow = ({ columns, props, loading, type }: IDataTableRowProps) => {
  const cells = Object.values(props);
  const { width, breakpoint } = useWindowSize();
  const navigate = useNavigate();
  const baseStyle = `text-left transition duration-200 border-y-[1px] border-neutral-800 ${loading ? '' : 'hover:bg-gray-900 hover:cursor-pointer'}`

  const route = (firstCol: string) => {
    let url = '/';
    switch(type) {
      case 'explore': // TODO: fix
        url = `${url}peers`;
        break;
      case 'pairs':
        url = `${url}pairs`;
        break;
      case 'peers':
        url = `${url}peers`;
        break;
      case 'orderbook':
        url = `${url}fulfill`;
        break;
      default:
        break;
    }
    navigate(`${url}/${firstCol}`)
  }
    // Desktop
    if (width >= 900) {
      return (
        <tr
          className={baseStyle}
          onClick={(e) => route(cells[0])}
        >
          {cells.map((cell, i) => (
            <td 
              key={`data-table-cell-${i}-${Math.floor(Math.random() * 1000)}`}
              className="py-2 pl-4"
            >
              {cell}
            </td>
          ))}
        </tr>
      );
    // Mobile
    } else {
      return (
        <tr
          className={`${baseStyle} flex flex-col px-4 py-1`}
          onClick={(e) => route(cells[0])}
        >
          {cells.map((cell, i) => (
            <td 
              key={`data-table-cell-${i}-${Math.floor(Math.random() * 1000)}`}
              className="py-0.5 pl-4 flex justify-between items-center"
            >
              <span>{columns[i]}</span>
              <span>{cell}</span>
            </td>
          ))}
        </tr>
      );
    }
}