import React from 'react'
import {StyleSheet ,View, Button, TextInput, FlatList, Text, ActivityIndicator} from 'react-native'
import Films from '../Helpers/FilmsDatas'
import FilmItem from './FilmItem'
import {getFilmsFromApiWithSearchedText} from '../API/TMDBApi'

class Search extends React.Component{

    constructor(props){
        super(props)
        this.state = { 
            films : [],
            isLoading : false
         }
        this.SearchedText = ""
        this.page = 0
        this.totalPage = 0
    }

    _loadFilms(){
        this.setState({isLoading : true})
        if(this.SearchedText.length > 0 ){
            getFilmsFromApiWithSearchedText(this.SearchedText, this.page+1).then(data => {
                this.page = data.page
                this.totalPage = data.total_pages
                this.setState({
                    films : [...this.state.films, ...data.results],
                    isLoading : false
                })
            })
        }
    }

    _displayLoading(){
        if(this.state.isLoading){
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _searchFilms () {
        this.page = 0
        this.totalPage = 0
        this.setState({
                films : []
            }, () => {
            this._loadFilms()
        })
    }

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate("FilmDetail", {idFilm : idFilm})
    }

    _searchTextInputChanget(text){
        this.SearchedText = text
    }

    render() {
        console.log(this.state.isLoading)
        return(
            <View style={styles.main_content}>
                <TextInput placeholder='Titre du film' style={styles.Textinput} onSubmitEditing={() => this._searchFilms()} onChangeText={(text) => this._searchTextInputChanget(text)} />
                <Button title='Rechercher' onPress={() => {this._searchFilms()}} style={styles.Button} />
                <FlatList
                    data={this.state.films}
                    onEndReachedThreshold = {0.5}
                    onEndReached = {() => {
                        if(this.page < this.totalPage){
                            this._loadFilms()
                        }
                    }}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <FilmItem film={item} displayDetailForFilm = {this._displayDetailForFilm} />}
                />
                {this._displayLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main_content : {
        flex : 1,
        marginTop : 10
    },
    Textinput: {
        marginLeft: 5,
        marginRight: 5,
        marginBottom : 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5,
        borderRadius : 5
    },
    Button : {
        borderRadius : 5,
        marginLeft :20,
        marginTop : 20
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
})

export default Search