export type User = {
    id: number,
    firstName: string,
    lastName: string,
    mail: string,
    nickname: string,
    photo: string
    notifications: Notification[]
    comments: Comment[],
    stylings: Styling[]
  }

  export type Notification = {
    id: number,
    message: string,
    read: boolean
  }

  export type Comment = {
    id: number,
    message: string,
    time: string,
    edited: boolean,
  }

  export type Styling = {
    id: number,
    name: string,
    description: string,
    photo: string,
    private: boolean,
    totalVotes: number,
    votes: Vote[]
  }

  export type Vote = {
    id: number,
    points: number
  }

  export type Show = {
    id: number,
    creatorId: number,
    topic: string,
    banner: string,
    maxParticipantsNumber: number,
    joiningDate: string,
    votingTime: string,
    categories: Categorie[],
    comments: Comment[],
    stylings: Styling[]
  }

  export type Categorie = {
    id: number,
    name: string
  }