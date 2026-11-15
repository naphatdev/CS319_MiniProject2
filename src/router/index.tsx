import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '../components/layout/RootLayout'
import { ExplorePage } from '../pages/ExplorePage'
import { ComponentDetailPage } from '../pages/ComponentDetailPage'
import { CollectionPage } from '../pages/CollectionPage'
import { PlaygroundPage } from '../pages/PlaygroundPage'
import { AboutPage } from '../pages/AboutPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { LoginPage } from '../pages/LoginPage'
import { ManageComponentsPage } from '../pages/ManageComponentsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: ExplorePage },
      { path: 'components/:id', Component: ComponentDetailPage },
      { path: 'collection', Component: CollectionPage },
      { path: 'playground', Component: PlaygroundPage },
      { path: 'about', Component: AboutPage },
      { path: 'login', Component: LoginPage },
      { path: 'manage', Component: ManageComponentsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
