import Home from './Home'
import Batch from './Batch'
import Modify from './Modify'
import Personal from './Personal'

export default [
    {
        path: '',
        name: 'home',
        component: Home
    },
    {
        path: '/batch/:page?',
        name: 'batch',
        component: Batch
    },
    {
        path: '/modify',
        name: 'modify',
        component: Modify
    },
    {
        path: '/personal',
        name: 'personal',
        component: Personal
    }
]