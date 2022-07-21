import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'

import Logo from '../assets/logo.png'
import Thumb from '../assets/thumb.webp'


/* Typescript/JS - Interface
    Interface: Espero receber este formato de dados
*/

interface IUserList {
    id: string,
    image: string,
    name: string,
    balance: {
        currency: number,
        miles: number,
        opcional?: number,
        points: number
    }
}

interface IUser {
    id: string,
    image: string,
    name: string,
    balance:{
        currency: number,
        miles: number,
        points: number
    },
    program: string,
    level: string
}

interface ILevel {
    id: string,
    name: string,
    description: string
}

interface IActivity {
    id: string,
    date: string,
    description: string
}

export const Home = () => {
    const [ token, setToken ] = useState('')
    const [ users, setUsers ] = useState<IUserList []>()
    const [ userInfo, setUserInfo ] = useState<IUser>()
    const [ levels, setLevels ] = useState<ILevel []>([])
    const [ activities, setActivities ] = useState<IActivity []>([])

    const URL = 'https://challenge-fielo.herokuapp.com'
   
    const getUsers = useCallback((token: string) => {
        axios.get(URL + '/users', {
            headers: {
                'x-access-token': token
            }
        }).then((response) => {
            // Tipagem de dados - Declarado no inicio da interface 'as IUserList'
            const data = response.data as IUserList []
            setUsers(data.sort((a, b) => b.balance.points - a.balance.points ))        
        })
    }, [])
    // Linha 68: Usamos os colchetes para passar o parametro 'token' como um array

    const getUserId = useCallback((id: string)=> {
        axios.get(URL + '/users/' + id, {
            headers: {
                'x-access-token': token
            }
        }).then(async(response) => {
            
            axios.get(URL + `/users/${response.data.id}/activities/`, {
                headers: {
                    'x-access-token': token
                }
            }).then(response => {
                const data = response.data as IActivity []

                setActivities(data)
                // setActivities(data.map(activity => {
                //     return {
                //         id: activity.id,
                //         date: new Date(activity.date),
                //         description: activity.description
                //     }
                // }))
            })

            const program = await axios.get(URL + '/programs/' + response.data.programId, {
                headers: {
                    'x-access-token': token
                }
            })

            const level = await axios.get(URL + '/levels/' + response.data.levelId, {
                headers: {
                    'x-access-token': token
                }
            })

            axios.get(URL + `/programs/${response.data.programId}/levels/`, {
                headers: {
                    'x-access-token': token
                }
            }).then(response => {
                setLevels(response.data)
            })
            
            setUserInfo({
                id: response.data.id,
                image: response.data.image,
                name: response.data.name,
                balance: {
                    currency: response.data.balance.currency,
                    //currency: Math.round((response.data.balance.currency * 100) / 100),
                    //currency: parseFloat(response.data.balance.currency).toFixed(2),
                    miles:  response.data.balance.miles,
                    points:  response.data.balance.points,
                },
                program: program.data.name,
                level: level.data.name
            })
        })        
    }, [token])
    

    useEffect(() => {
        axios.post(URL + '/auth', {
            headers: {
                'x-app-id': 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCh7uxHjWd1CyRgPD4XHcIPKiDb'
            }
        }).then(response => {
            setToken(response.data.token)
            getUsers(response.data.token)
        })

        // axios.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', {
        //     headers: {
        //         'Access-Control-Allow-Origin': '*',
        //         'Access-Control-Allow-Headers': '*',
        //         'Access-Control-Allow-Credentials': 'true',
        //         'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
        //     }
        // }).then(response => {
        //     console.log("Deu certo :D, ", response.data);
        // })
        // .catch(error => {
        //     console.log("Não deu certo... ", error);
        // })
    }, [])
    
    return (
        <div className="wrapper" style={{backgroundImage: "URL('https://www.bing.com/th?id=OHR.OmijimaIsland_PT-BR9957032794_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp')"}}>
            <header className="header">
                <a href="./" title="Home New Roots">
                    <img src={Logo} className="logo-header"  alt="New Roots" />
                </a>
            </header>
            
            <section className="container">
    
                <div className="card list-members">
    
                    <div className="card-header">
                        <ul>
                            <li className="w-pos text-center">Pos.</li>
                            <li className="group-header">Member</li>
                            <li>Points</li>
                        </ul>
                    </div>
    
                    <div className="card-body">
                        {/* Linha 180: Usamos o 'map' para percorrer o array 'users'*/}
                        {users?.map((user, index) => (
                            <div className="row" key={user.id}>
                                <a href="#" onClick={() => getUserId(user.id) }>
                                    <span className="w-pos text-center">{index + 1 }</span>
                                    <span className="group-member">
                                        <img src={user.image || Thumb} className="thumb-profile" alt={user.name} />
                                        <span className="member">{user.name}</span>
                                    </span>
                                    <strong>{user.balance.points}</strong>
                                </a>
                            </div>
                        ))}                            
                    </div>
                    <div className="card-footer"></div>
                </div>

                {userInfo && (
                    <div className="card detail-members">

                        <div className="profile">
                            <img src={userInfo.image || Thumb} className="thumb-profile-medium" alt="Name Dynamic" />
                            <span className="profile-name">{userInfo.name}</span>
                            <div className="wrap-select">
                                <select defaultValue={userInfo.program}>
                                    <option value={userInfo.program}>{userInfo.program}</option>
                                </select>
                            </div>
                        </div>
        
                        <div className="resume">
                            <div className="group-values">
                                <div className="flex">
                                    <i className="uil uil-circle-layer"></i> 
                                    <span>{userInfo.balance.points}</span>
                                </div>
                                <span className="lb">Points</span>
                            </div>
                            <div className="group-values">
                                <i className="fa-regular fa-link-horizontal"></i> {userInfo.balance.miles}
                                <span className="lb">Miles</span>
                            </div>
                            <div className="group-values">
                                <span><i className="uil uil-dollar-alt"></i> {parseFloat(String (userInfo.balance.currency)).toFixed(2)}</span>
                                <span className="lb">Currency</span>
                            </div>
                        </div>
        
                        {levels.length > 0 && (
                            <div className="levels">
                                {levels.map(level => (
                                    <div className={level.name === userInfo.level ? 'level active' : 'level'} key={level.id}>
                                        <span className="lb-status">{level.name}</span>
                                        <input 
                                            type="radio"
                                            name="level"
                                            value={level.name}
                                            checked={level.name === userInfo.level}
                                            disabled={!(level.name === userInfo.level)}
                                            readOnly
                                        />
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>                    
                )}
                
                {userInfo && activities.length > 0 && (
                    <div className="card feed-members">
                        <div className="card-header">
                            <i className="uil uil-rss-alt"></i> Activity Feed
                        </div>
        
                        <div className="card-body">
        
                            {activities.map(activity => (
                                <div className="row" key={activity.id}>
                                    <div className="col col-icon">
                                        <i className="uil uil-compass"></i>
                                    </div>
                                    <div className="col col-content">
                                        <span className="date">{String(activity.date)}</span>
                                        <span>{activity.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    
                    </div>
                )}                
    
            </section>
        </div>
    )
}   