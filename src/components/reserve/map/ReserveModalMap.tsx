'use client'

import React, { Dispatch, FC, Fragment, SetStateAction } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import ReserveMap from './ReserveMap'
import { MarkerType } from '../content/ReserveContent'

interface IReserveModalMap {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    marker: MarkerType | null;
    setMarker: React.Dispatch<React.SetStateAction<MarkerType | null>>;
}

const ReserveModalMap: FC<IReserveModalMap> = ({ isOpen, setIsOpen, marker, setMarker }) => {

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 shadow-xl bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 shadow-xl transition-all">
                                <Dialog.Title className="text-lg font-medium text-foreground">
                                    نقشه
                                </Dialog.Title>
                                <div className="mt-2">
                                    <div className="text-sm w-full h-[400px] z-100">
                                        <ReserveMap marker={marker} setMarker={setMarker} />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                    >
                                        بستن
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ReserveModalMap
