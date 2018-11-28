import React, {Component} from 'react';
import {
  Popover,
  PopoverBody,
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  NavItem,
  NavLink,
  CardImg,
  CardTitle,
  CardText,
  CardBody
} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleClickLikeOff = this.handleClickLikeOff.bind(this);
    this.handleClickLikeOn = this.handleClickLikeOn.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
      viewOnlyLike: false,
      moviesCount: 0,
      moviesNameList: [],
      movies: [],
      moviesLiked: []
    };
  }

  componentDidMount() {
    var ctx = this;
    fetch('http://localhost:3000/movie').then(function(response) {
      return response.json();
    }).then(function(data) {
      ctx.setState({movies: data.results});
    }).catch(function(error) {
    });

    fetch('http://localhost:3000/mymovies').then(function(response) {
      return response.json();
    }).then(function(data) {
      ctx.setState({moviesLiked: data.movies});
    }).catch(function(error) {
    });

  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  handleClickLikeOff() {
    this.setState({viewOnlyLike: false});
  }

  handleClickLikeOn() {
    this.setState({viewOnlyLike: true});
  }

  handleClick(isLike, name) {
    var moviesNameListCopy = [...this.state.moviesNameList];

    if (isLike == true) {
      moviesNameListCopy.push(name);
      this.setState({
        moviesCount: this.state.moviesCount + 1,
        moviesNameList: moviesNameListCopy
      })
    } else {
      var index = moviesNameListCopy.indexOf(name);
      moviesNameListCopy.splice(index, 1);
      this.setState({
        moviesCount: this.state.moviesCount - 1,
        moviesNameList: moviesNameListCopy
      })
    }
  }

  render() {
    var ctx = this;
      var moviesLiked = [];
      if (this.state.movies != undefined) {

            for (var i = 0; i < this.state.movies.length; i++) {
              var isLike = false;
              for (var y = 0; y < this.state.moviesLiked.length; y++) {
                if (this.state.movies[i].id == this.state.moviesLiked[y].idMovieDB) {
                  isLike = true;
                  break;
                }
              }

              moviesLiked.push(<Movie key={i} handleClickParent={this.handleClick} idMovieDB={this.state.movies[i].id} movieName={this.state.movies[i].title} movieDesc={this.state.movies[i].overview.substr(0, 100) + "..."} movieImage={this.state.movies[i].poster_path} displayOnlyLike={this.state.viewOnlyLike} isLike={isLike}/>);
            }
          }

    var lastName = "";

    var moviesNameListCopy = [...this.state.moviesNameList];

    if (moviesNameListCopy.length > 0) {
      lastName = moviesNameListCopy.pop();
    }
    if (moviesNameListCopy.length > 0) {
      lastName = lastName + ', ' + moviesNameListCopy.pop();
    }
    if (moviesNameListCopy.length > 0) {
      lastName = lastName + ', ' + moviesNameListCopy.pop();
    }
    if (moviesNameListCopy.length > 0) {
      lastName = lastName + '...';
    }

    return (<Container className="col-12" style={{
        backgroundColor: '#000000',
        paddingRight: '300px',
        paddingLeft: '300px'
      }}>

      <Row style={{
          marginBottom: '15px'
        }}>
        <Col>
          <Nav>
            <NavItem>
              <NavLink href="#"><img src="logo.png"/></NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.handleClickLikeOff} style={{
                  color: '#FFFFFF'
                }} href="#">
                Last releases</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.handleClickLikeOn} style={{
                  color: '#FFFFFF'
                }} href="#">My movies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <Button id="Popover1" onClick={this.toggle}>
                  {this.state.moviesCount}
                  Movie
                </Button>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                  <PopoverBody>{lastName}</PopoverBody>
                </Popover>
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>

      <Row>
        {moviesLiked}
      </Row>

    </Container>)
  }
}

class Movie extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      like: this.props.isLike
    };
  }

  handleClick() {
    var isLike = !this.state.like;
    var movieName = this.props.movieName;
    this.setState({like: isLike});
    if (isLike) {
      fetch('http://localhost:3000/mymovies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'poster_path='+this.props.movieImage+'&overview='+this.props.movieDesc+'&title='+this.props.movieName+'&idMovieDB='+this.props.idMovieDB
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
      }).catch(function(error) {
      })
    } else {
      fetch('http://localhost:3000/mymovies/' + this.props.idMovieDB, {method: 'DELETE'})
    }
    this.props.handleClickParent(isLike, this.props.movieName);
  }

  render() {
    var colorHeart;
    if (this.state.like === true) {
      colorHeart = {
        color: "#FF5B53",
        cursor: "Pointer"
      }
    }

    var isDisplay;
    if (this.props.displayOnlyLike == true && this.state.like == false) {

      isDisplay = {
        display: "none"
      }
    }

    return (<Col xs="3" style={isDisplay}>
      <Card style={{
          marginBottom: '15px'
        }}>
        <CardImg top="top" width="100%" src={"https://image.tmdb.org/t/p/w500/" + this.props.movieImage} alt="Card image cap"/>
        <CardBody>
          <FontAwesomeIcon style={colorHeart} onClick={this.handleClick} icon={faHeart}/>
          <CardTitle>{this.props.movieName}</CardTitle>
          <CardText>{this.props.movieDesc}</CardText>
        </CardBody>
      </Card>
    </Col>);

  }
}

export default App;
