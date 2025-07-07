export interface IComment {
    name: string;
    title: string;
    caption: string;
}

export interface ICommentAll {
    id: string,
    house_id: string,
    user_id: string,
    title: string | null,
    caption: string | null,
    rating: string | null,
    created_at: string,
    parent_comment_id: string | null
}

export interface IGetComment {
    id: string,
    house_id: string,
    user_id: string,
    title: string | null,
    caption: string | null,
    rating: string | null,
    created_at: string,
    parent_comment_id: string | null
}

export type IParentComment = {
    id: string,
    house_id: string,
    user_id: string,
    title: string | null,
    caption: string | null,
    rating: string | null,
    created_at: string,
    parent_comment_id: string | null
}