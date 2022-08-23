import styled from 'styled-components';
import { MdSearch } from 'react-icons/md';
import { colors } from '../styles/colors';
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, lighten } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableSortLabel,
  TablePagination,
} from '@material-ui/core';
import ScrollAnimation from 'react-animate-on-scroll';
import Head from 'next/head';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ContractContext, GlobalContext } from '../context';
import { config } from '../config';
import { getScore, groupBy, humanizeAddress } from '../helpers';
import { useMediaQuery } from '../hooks'

function desc3(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort3(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc3(a, b, orderBy)
    : (a, b) => -desc3(a, b, orderBy);
}

const headRows3 = [
  {
    id: 'rank',
    numeric: false,
    disablePadding: true,
    label: 'Rank',
  },
  { id: 'user', numeric: true, disablePadding: false, label: 'User' },
  { id: 'score', numeric: true, disablePadding: false, label: 'Score' },
];

const headRows4 = [
  {
    id: 'rank',
    numeric: false,
    disablePadding: true,
    label: 'Rank',
  },
  { id: 'user', numeric: true, disablePadding: false, label: 'User' },
  {
    id: 'score',
    numeric: true,
    disablePadding: false,
    label: 'Score',
  },

];

function EnhancedTableHead3(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const classes3 = useStyles3();

  return (
    <TableHead className={classes3.tableHead}>
      <TableRow>
        {headRows3.map((row) => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
function EnhancedTableHead4(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const classes3 = useStyles3();
  return (
    <TableHead className={classes3.tableHead}>
      <TableRow>
        {headRows4.map((row) => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead3.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

EnhancedTableHead4.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles3 = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '70px',
    // boxShadow: "0px 0px 2rem rgb(76 76 109 / 50%)",
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(5),
    boxShadow: 'none',
    borderRadius: '0.5rem',
    [theme.breakpoints.down('475')]: {
      paddingRight: theme.spacing(3),
      paddingLeft: theme.spacing(3),
    },
  },
  table: {
    minWidth: 750,
    [theme.breakpoints.down('475')]: {
      minWidth: 330,
    },
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '0.5rem',
    border: '1px solid rgba(48,71,94,0.5)',
  },
  // tableHead: {
  //   color: "#30475E",
  //   padding: "0.8rem 1.5rem !important",
  //   background: "rgba(21,114,161,0.1)",
  // },
}));

export default function Leaderboard() {
  const { globalStateChanged, getProviderOrSigner } = useContext(GlobalContext);
  const { getRewards } = useContext(ContractContext);
  const isBreakpoint = useMediaQuery(768)

  const classes3 = useStyles3();
  const [order3, setOrder3] = React.useState('asc');
  const [orderBy3, setOrderBy3] = React.useState('amount');
  const [page3, setPage3] = React.useState(0);
  const [rowsPerPage3, setRowsPerPage3] = React.useState(5);
  const [scores, setScores] = React.useState([]);
  const [balances, setBalances] = React.useState([]);
  const [earners, setEarners] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let _scores = {};
      const provider = await getProviderOrSigner();
      const sdk = new ThirdwebSDK(provider);

      // get players
      const collection = sdk.getNFTCollection(config.PLAYER_NFT_ADDRESS);
      const players = await collection.getAll();

      players.forEach((nft) => {
        const { properties, attributes } = nft?.metadata;
        const type = (properties || attributes || []).find(
          (attribute) => attribute.trait_type === 'type'
        );

        let _score = getScore(type?.value?.toLowerCase(), 1);
        console.log({ nft })

        _scores[nft['owner']] = (_scores[nft['owner']] || 0) + _score;
      });

      // get votes
      const votes = sdk.getNFTCollection(config.VOTE_NFT_ADDRESS);
      const _votes = await votes.getAll();

      _votes.forEach((nft) => {
        let _score = getScore('vote', 1);
        _scores[nft['owner']] = (_scores[nft['owner']] || 0) + _score;
      });

      // get voucher scores
      const vouchers = sdk.getNFTCollection(config.VOUCHER_ADDRESS);
      let _vouchers = await vouchers.getAll();

      _vouchers.forEach((nft) => {
        const { properties, attributes } = nft?.metadata;
        const type = (properties || attributes || []).find(
          (attribute) => attribute.trait_type === 'type'
        );

        let _score = getScore(type?.value?.toLowerCase(), 5);

        _scores[nft['owner']] = (_scores[nft['owner']] || 0) + _score;
      });

      // get game items scores
      const gameItems = sdk.getEdition(config.GAME_ITEM_ADDRESS);
      const _gameItems = await gameItems.getAll();

      _gameItems.forEach((nft) => {
        const { properties, attributes } = nft?.metadata;
        const type = (properties || attributes || []).find(
          (attribute) => attribute.trait_type === 'type'
        );

        let _score = getScore(type?.value?.toLowerCase(), 0.5);

        _scores[nft['owner']] = (_scores[nft['owner']] || 0) + _score;
      });

      // sort items by score
      const sortedScores = Object.entries(_scores).sort((a, b) => b[1] - a[1]);
      setScores(
        sortedScores.map(([key, value], i) => ({
          rank: i + 1,
          user: key,
          score: value,
        }))
      );

      // Marketplace contract
      const marketplace = sdk.getMarketplace(config.MARKETPLACE_ADDRESS);

      const listings = await marketplace.getAllListings();

      let listingPrices = {};

      // get players listingPrices
      listings.forEach(async (listing) => {
        const {
          id: listingId,
          buyoutPrice,
          assetContractAddress,
          tokenId,
          sellerAddress,
          quantity,
          type,
          currencyContractAddress,
        } = listing;

        let listed = listingPrices[sellerAddress] || [];

        listed.push({
          listingId: Number(listingId),
          buyoutPrice,
          tokenId,
          assetContractAddress,
          currencyContractAddress,
          quantity,
        });

        listingPrices[sellerAddress] = listed;
      });

      let portolio = {};

      // players.forEach((player) => {
      //   const { owner } = player;
      //   const listings = listingPrices[address] || [];

      //   let total = 0;

      //   listings.forEach((listing) => {
      //     total += listing.buyoutPrice;
      //   }
      //   );

      //   portolio[address] = total;
      // }
    };
    const fetchPlayers = async () => {
      let { data } = await config.axios.get('/api/users/portfolio');
      data = JSON.parse(data)?.data || [];
      setBalances(
        data
          .sort((a, b) => b.balance - a.balance)
          .map((player, i) => ({
            rank: i + 1,
            user: player.user,
            balance: player.balance,
          }))
      );
    };
    fetchPlayers();

    fetchData();

    getRewards().then((rewards) => {
      rewards = Object.entries(groupBy(rewards, 'recipient'))
        .map(([key, value]) => ({
          user: key,
          rewards: value.reduce((a, b) => a.amount + b.amount, 0),
        }))
        .sort((a, b) => b.rewards - a.rewards);

      setEarners(
        rewards.map((reward, i) => ({
          ...reward,
          rank: i + 1,
        }))
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalStateChanged]);
  function handleRequestSort3(event, property) {
    const isDesc = orderBy3 === property && order3 === 'desc';
    setOrder3(isDesc ? 'asc' : 'desc');
    setOrderBy3(property);
  }

  function handleChangePage3(event, newPage) {
    setPage3(newPage);
  }

  function handleChangeRowsPerPage3(event) {
    setRowsPerPage3(+event.target.value);
  }

  const emptyRows3 =
    rowsPerPage3 -
    Math.min(rowsPerPage3, earners.length - page3 * rowsPerPage3);

  const emptyRows4 =
    rowsPerPage3 - Math.min(rowsPerPage3, scores.length - page3 * rowsPerPage3);

  return (
    <StyledLeaderboard>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
      </Head>
      {/* <div className="container"> */}
      <div className="content">
        {' '}
        {/* <h3 className="title">All-time Top Earners</h3> */}
        <div className="wrapper">
          <ScrollAnimation duration={2} animateIn="bounceInRight" animateOnce>
            <div className="table-box">
              <div className="separator separator-dashed my-7"></div>
              <div className={classes3.root}>
                <Paper className={classes3.paper}>
                  {/* <EnhancedTableToolbar3 /> */}
                  <div className="d-flex align-items-center py-2">
                    <Typography variant="h4">All-time Top Earners</Typography>
                    <StyledSearchBar onSubmit={(e) => e.preventDefault()}>
                      <MdSearch size={24} />
                      <input
                        type="text"
                        placeholder="Search"
                      // value={search}
                      // onChange={(e) => setSearch(e.target.value)}
                      />
                    </StyledSearchBar>
                  </div>
                  {earners.length > 0 ? (
                    <>
                      <div className={classes3.tableWrapper}>
                        <Table
                          className={classes3.table}
                          aria-labelledby="tableTitle"
                          size="medium"
                        >
                          <EnhancedTableHead3
                            order={order3}
                            orderBy={orderBy3}
                            onRequestSort={handleRequestSort3}
                            rowCount={earners.length}
                          />
                          <TableBody>
                            {stableSort3(earners, getSorting(order3, orderBy3))
                              .slice(
                                page3 * rowsPerPage3,
                                page3 * rowsPerPage3 + rowsPerPage3
                              )
                              .map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={index}
                                  >
                                    <TableCell
                                      component="th"
                                      id={labelId}
                                      scope="row"
                                      padding="none"
                                    >
                                      {row.rank}
                                    </TableCell>
                                    <TableCell align="right">
                                      {isBreakpoint ? humanizeAddress(row.user) : row.user}
                                    </TableCell>
                                    {/* <TableCell align="right">
                                    {row.clubChallenges}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.worth}
                                  </TableCell> */}
                                    <TableCell align="right">
                                      {row.score}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            {emptyRows3 > 0 && (
                              <TableRow style={{ height: 49 * emptyRows3 }}>
                                <TableCell colSpan={6} />
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={earners.length}
                        rowsPerPage={rowsPerPage3}
                        page={page3}
                        backIconButtonProps={{
                          'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                          'aria-label': 'Next Page',
                        }}
                        style={{ overflow: 'visible' }}
                        onPageChange={handleChangePage3}
                        onRowsPerPageChange={handleChangeRowsPerPage3}
                      />
                    </>
                  ) : (
                    <div className="text-center">
                      <Typography variant="body1" className="pb-4">
                        No players rewarded yet
                      </Typography>
                    </div>
                  )}
                </Paper>
              </div>
            </div>
          </ScrollAnimation>
        </div>
        <div className="wrapper">
          <ScrollAnimation duration={2} animateIn="bounceInLeft" animateOnce>
            <div className="table-box">
              <div className="separator separator-dashed my-7"></div>
              <div className={classes3.root}>
                <Paper className={classes3.paper}>
                  {/* <EnhancedTableToolbar4 /> */}
                  <div className="d-flex align-items-center py-2">
                    <Typography variant="h4">User Score</Typography>
                    <StyledSearchBar onSubmit={(e) => e.preventDefault()}>
                      <MdSearch size={24} />
                      <input
                        type="text"
                        placeholder="Search"
                      // value={search}
                      // onChange={(e) => setSearch(e.target.value)}
                      />
                    </StyledSearchBar>
                  </div>
                  <div className={classes3.tableWrapper}>
                    <Table
                      className={classes3.table}
                      aria-labelledby="tableTitle"
                      size="medium"
                    >
                      <EnhancedTableHead4
                        order={order3}
                        orderBy={orderBy3}
                        onRequestSort={handleRequestSort3}
                        rowCount={scores.length}
                      />
                      <TableBody>
                        {stableSort3(scores, getSorting(order3, orderBy3))
                          .slice(
                            page3 * rowsPerPage3,
                            page3 * rowsPerPage3 + rowsPerPage3
                          )
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  padding="none"
                                >
                                  {row.rank}
                                </TableCell>
                                <TableCell align="right" id={labelId}>
                                  {isBreakpoint ? humanizeAddress(row.user) : row.user}
                                </TableCell>
                                <TableCell align="right">{row.score}</TableCell>
                                {/* <TableCell align="right">
                                    {row.userscore_clubChallenges}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.userscore_worth}
                                  </TableCell> */}
                              </TableRow>
                            );
                          })}
                        {emptyRows4 > 0 && (
                          <TableRow style={{ height: 49 * emptyRows4 }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={scores.length}
                    rowsPerPage={rowsPerPage3}
                    page={page3}
                    backIconButtonProps={{
                      'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                      'aria-label': 'Next Page',
                    }}
                    style={{ overflow: 'visible' }}
                    onPageChange={handleChangePage3}
                    onRowsPerPageChange={handleChangeRowsPerPage3}
                  />
                </Paper>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation duration={2} animateIn="bounceInRight" animateOnce>
            <div className="table-box">
              <div className="separator separator-dashed my-7"></div>
              <div className={classes3.root}>
                <Paper className={classes3.paper}>
                  {/* <EnhancedTableToolbar3 /> */}
                  <div className="d-flex align-items-center py-2">
                    <Typography variant="h4">Portfolio Values</Typography>
                    <StyledSearchBar onSubmit={(e) => e.preventDefault()}>
                      <MdSearch size={24} />
                      <input
                        type="text"
                        placeholder="Search"
                      // value={search}
                      // onChange={(e) => setSearch(e.target.value)}
                      />
                    </StyledSearchBar>
                  </div>
                  <div className={classes3.tableWrapper}>
                    <Table
                      className={classes3.table}
                      aria-labelledby="tableTitle"
                      size="medium"
                    >
                      <EnhancedTableHead3
                        order={order3}
                        orderBy={orderBy3}
                        onRequestSort={handleRequestSort3}
                        rowCount={balances.length}
                      />
                      <TableBody>
                        {stableSort3(balances, getSorting(order3, orderBy3))
                          .slice(
                            page3 * rowsPerPage3,
                            page3 * rowsPerPage3 + rowsPerPage3
                          )
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={index}
                              >
                                <TableCell
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                  padding="none"
                                >
                                  {row.rank}
                                </TableCell>
                                <TableCell align="right">{isBreakpoint ? humanizeAddress(row.user) : row.user}</TableCell>
                                {/* <TableCell align="right">
                                    {row.clubChallenges}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.worth}
                                  </TableCell> */}
                                <TableCell align="right">
                                  {parseFloat(row.balance || '0')} MATIC
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows3 > 0 && (
                          <TableRow style={{ height: 49 * emptyRows3 }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={earners.length}
                    rowsPerPage={rowsPerPage3}
                    page={page3}
                    backIconButtonProps={{
                      'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                      'aria-label': 'Next Page',
                    }}
                    style={{ overflow: 'visible' }}
                    onPageChange={handleChangePage3}
                    onRowsPerPageChange={handleChangeRowsPerPage3}
                  />
                </Paper>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
      {/* </div> */}
    </StyledLeaderboard>
  );
}

const StyledLeaderboard = styled.div`
  padding: 2rem 10rem 6rem;
  min-height: 100vh;
  position: relative;
  background-color: #eef0f8;
  h1 {
    color: ${colors.primary};
  }
  h4 {
    padding: 20px;
    color: #30475e;
    flex: 3;
    font-weight: 600;
    @media (max-width: 992px) {
      flex: 2.2;
    }
    @media (max-width: 768px) {
      flex: 2;
      font-size: 20px;
    }
    @media (max-width: 576px) {
      font-size: 20px;
    }
    @media (max-width: 475px) {
      font-size: 18px;
      padding: 10px;
    }
  }
  .MuiTableCell-root {
    font-size: 1rem;
  }
  .MuiTableCell-head {
    color: #30475e;
    padding: 0.8rem 1.5rem !important;
    background: rgba(21, 114, 161, 0.1);
    border-bottom: 1px solid rgba(48, 71, 94, 0.5);
    margin-bottom: 0.5rem !important;
  }
  .MuiTableCell-head:not(:last-child) {
    border-right: 1px solid rgba(48, 71, 94, 0.5);
  }
  .MuiTableCell-head {
    margin-bottom: 0.5rem;
  }
  .MuiTableCell-root:not(:last-child) {
    border-right: 1px solid rgba(48, 71, 94, 0.5);
  }
  .MuiTableCell-root {
    padding: 0.8rem 1.5rem !important;
    font-weight: 600;
    color: #30475e;
  }
  .MuiTablePagination-toolbar {
    padding-left: 0;
  }
  .MuiTablePagination-toolbar p,
  .MuiTablePagination-toolbar input,
  .MuiTablePagination-toolbar div {
    font-weight: 600;
  }
  .PrivateSwitchBase-input-21 {
    opacity: 0;
  }
  .content {
    position: relative;
    z-index: 2;
    .title {
      margin-top: 2rem;
      color: ${colors.secondary};
    }
  }
  .table-box {
    box-shadow: 0px 0px 2rem rgb(76 76 109 / 50%);
    border-radius: 0.5rem;
  }
  .table {
    margin-top: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(${colors.secondaryRGB}, 0.5);
    min-width: 900px;
  }
  @media (max-width: 992px) {
    padding: 2rem;
  }
  @media (max-width: 475px) {
    padding: 0.1rem 1rem 2rem;
    .MuiTableCell-head {
      padding: 0.8rem !important;
    }
  }
`;

const StyledSearchBar = styled.form`
  flex: 1;
  display: block;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgba(${colors.tertiaryRGB}, 0.25);
  background-color: ${colors.background};
  position: relative;
  overflow: hidden;
  padding-left: 2rem;
  button {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    background: none;
    border: none;
    width: 2rem;
    cursor: pointer;
  }
  svg {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: ${colors.secondary};
  }
  input {
    background: none;
    width: 100%;
    height: 100%;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: ${colors.secondary};
    border: none;
    &::placeholder {
      color: ${colors.secondary};
    }
    &:focus {
      outline: none;
    }
  }
  &:focus-within {
    box-shadow: 0 20px 25px -5px rgba(${colors.tertiaryRGB}, 0.1),
      0 10px 10px -5px rgba(${colors.tertiaryRGB}, 0.04);
  }
`;
