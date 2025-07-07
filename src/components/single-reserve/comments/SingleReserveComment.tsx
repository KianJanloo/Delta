'use client'
import { useCallback, useEffect, useState } from 'react'
import { fetchComments } from '@/utils/service/api/fetchComments'
import SingleReserveForm from '../../common/CommentForm'
import SingleReserveComments from './SingleReserveComments'
import { IGetComment } from '@/types/comment-type/comment-type'

const PAGE_SIZE = 2

interface Props {
  id: string
}

const SingleReserveComment = ({ id }: Props) => {
  const [comments, setComments] = useState<IGetComment[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [viewReply, setViewReply] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [parent_comment_id, setParent_comment_id] = useState<string | null>(null)

  const fetchData = useCallback(async (pageNum: number) => {
    setIsFetching(true)
    try {
      const res = await fetchComments(id, pageNum, PAGE_SIZE) as { data: IGetComment[], totalCount: number }
      setComments(res.data)
      setTotalCount(res.totalCount)
    } catch {
      setComments([])
      setTotalCount(0)
    }
    setIsFetching(false)
    setIsLoading(false)
  }, [id])

  useEffect(() => {
    setIsLoading(true)
    fetchData(page)
  }, [id, page, fetchData])

  return (
    <div className="flex flex-col items-center gap-12 w-full">
      <SingleReserveForm
        parent_comment_id={parent_comment_id}
        title={title}
        viewReply={viewReply}
        refetch={() => fetchData(page)}
        setViewReply={setViewReply}
      />

      <svg width="999" height="3" viewBox="0 0 999 3" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="1.5" x2="999" y2="1.5" stroke="url(#paint0)" strokeWidth="3" />
        <defs>
          <linearGradient id="paint0" x1="999" y1="3.5" x2="0" y2="3.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AAAAAA" stopOpacity="0" />
            <stop offset="0.455" stopColor="#565656" />
            <stop offset="1" stopColor="#AAAAAA" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <SingleReserveComments
        comments={comments}
        totalCount={totalCount}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        setPage={setPage}
        setTitle={setTitle}
        setParent_comment_id={setParent_comment_id}
        setViewReply={setViewReply}
      />
    </div>
  )
}

export default SingleReserveComment
