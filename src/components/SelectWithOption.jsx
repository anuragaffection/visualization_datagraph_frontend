import { Fragment,  useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import ProgressBar from './ProgressBar';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function SelectWithOption({ fullData }) {

    if (fullData.length === 0) {
        return null
    }

    const totalCount = fullData.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.count
    }, 0);

    const [selected, setSelected] = useState(fullData[3]);
    const [frequency, setFrequency] = useState(fullData[3].count);
    const [percentage, setPercentage] = useState(2 * Math.round((100 / totalCount) * fullData[3].count))

   
    const handleClick = (d, count) => {
        setSelected(d)
        setFrequency(count)
        setPercentage(2 * Math.round((100 / totalCount) * count))
    }

    const firstLetterToUpperCase = (topic) => {
        return topic.slice(0, 1).toUpperCase() + topic.slice(1)
    }

    return (
        <>
            <div className='flex gap-2 justify-between items-center'>

                <div className='flex-1'>
                    {
                        fullData.length > 0 && (
                            <Listbox value={selected} >
                                {({ open }) => (
                                    <>
                                        <div className="relative mt-2">
                                            <Listbox.Button
                                                className="relative w-full cursor-default rounded-md bg-gray-900 py-1.5 pl-3 pr-10 text-left text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                            >
                                                <span className="flex items-center">
                                                    <span className="ml-3 block truncate">
                                                        {selected ? firstLetterToUpperCase(selected.topic) : 'Select'}
                                                    </span>
                                                </span>
                                                <span
                                                    className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"
                                                >
                                                    <ChevronUpDownIcon
                                                        className="h-5 w-5 text-gray-400" aria-hidden="true"
                                                    />
                                                </span>
                                            </Listbox.Button>

                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options
                                                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {
                                                        fullData.map((d, index) => (
                                                            <Listbox.Option
                                                                key={index}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        active ? 'bg-indigo-600 text-white' : 'text-gray-100',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                    )
                                                                }
                                                                value={d.count}
                                                                onClick={() => handleClick(d, d.count)}
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <div className="flex items-center">
                                                                            <span
                                                                                className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                                            >
                                                                                {firstLetterToUpperCase(d.topic)}
                                                                            </span>
                                                                        </div>

                                                                        {selected ? (
                                                                            <span
                                                                                className={classNames(
                                                                                    active ? 'text-white' : 'text-indigo-600',
                                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                )}
                                                                            >
                                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}

                                                            </Listbox.Option>
                                                        ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        )
                    }
                </div>

                <div className='md:flex-1 mt-2 rounded bg-gray-900 text-gray-100 p-2 px-4 h-10'>
                    <div> {`Frequency = ${frequency}`} </div>
                </div>
            </div>


            <div>
                <ProgressBar percentage={percentage} />
            </div>

        </>
    )

}
