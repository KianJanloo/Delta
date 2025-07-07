import React, { useMemo, Dispatch, SetStateAction } from 'react'
import { QAWidget } from '@/components/common/CommentItem'
import { IGetComment } from '@/types/comment-type/comment-type'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Loader } from '@/components/common/Loader'

const PAGE_SIZE = 10

const SingleReserveComments = ({
  comments,
  totalCount,
  isLoading,
  isFetching,
  page,
  setPage,
  setViewReply,
  setTitle,
  setParent_comment_id,
}: {
  comments: IGetComment[]
  totalCount: number
  isLoading: boolean
  isFetching: boolean
  page: number
  setPage: Dispatch<SetStateAction<number>>
  setViewReply: Dispatch<SetStateAction<boolean>>
  setTitle: Dispatch<SetStateAction<string>>;
  setParent_comment_id: Dispatch<SetStateAction<string | null>>
}) => {
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / PAGE_SIZE)
  }, [totalCount])

  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }, [totalPages])

  return (
    <div className="flex flex-col mt-8 w-full">
      {isLoading || isFetching ? (
        <div className="flex justify-center w-fit h-fit mx-auto py-10">
          <Loader />
        </div>
      ) : !comments || comments.length === 0 ? (
        <p className="text-center text-sm text-subText mb-4">هیچ نظری وجود ندارد.</p>
      ) : (
        <div className="flex md:flex-row flex-col gap-4 max-md:gap-8 justify-center md:justify-start">
          {comments && comments.map((comment) => (
            <div key={comment.id} className="md:w-1/2 w-full mt-[30px]">
              <QAWidget
                {...comment}
                setParent_comment_id={setParent_comment_id}
                setViewReply={setViewReply}
                setTitle={setTitle}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1 || isFetching}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          <ChevronRight size={16} />
        </Button>

        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            disabled={isFetching}
            onClick={() => setPage(p)}
            className={` ${p === page ? "bg-primary text-primary-foreground" : ""} `}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages || isFetching}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          <ChevronLeft size={16} />
        </Button>
      </div>
    </div>
  )
}

export default SingleReserveComments
