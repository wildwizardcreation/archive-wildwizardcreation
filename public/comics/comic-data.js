
const comicSeriesData = [
    {
        comicName: 'Absolute-Superman',
        logoChar: "s",
        artists: {
            author: "Jason Aaron",
            illustrator: "Rafa Sandoval",
            colorist: "Ulises Arreola"
        },
        issues: [
            {
                issueNumber: 1,
                pageCount: 30,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-9051908.jpg",
                        artist: "Rafa Sandoval"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-9865515.jpg",
                        artist: "Dan Mora"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-5070193.jpg",
                        artist: "Clayton Crain"
                    }
                ]
            },
            {
                issueNumber: 2,
                pageCount: 24,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-7516194.jpg",
                        artist: "Sanford Greene"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-1553701.jpg?1748050768",
                        artist: "Mahmud Asrar"
                    }
                ]
            },
            {
                issueNumber: 3,
                pageCount: 23,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-9715787.jpg",
                        artist: "Mico Suayan"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-8357250.jpg",
                        artist: "Christian Ward"
                    }
                ]
            },
            {
                issueNumber: 4,
                pageCount: 25,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-4815183.jpg",
                        artist: "Rahzzah"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-2087831.jpg?1748067055",
                        artist: "Keron Grant"
                    }
                ]
            },
            {
                issueNumber: 5,
                pageCount: 23,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-3637356.jpg?1745127946",
                        artist: "Darick Robertson"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-6452561.jpg?1745127946",
                        artist: "Sean Murphy"
                    }
                ]
            },
            {
                issueNumber: 6,
                pageCount: 24,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-6730597.jpg?1745614599",
                        artist: "Rod Reis"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-9230830.jpg?1745614599",
                        artist: "Derrick Chew"
                    }
                ]
            },
            {
                issueNumber: 7,
                pageCount: 25,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-4956730.jpg?1750203007",
                        artist: "Dan Panosian"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-3705437.jpg?1750203007",
                        artist: "Lesley 'Leirix' Li"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-8202456.jpg?1750203007",
                        artist: "Jorge Molina"
                    }
                ]
            },
            {
                issueNumber: 8,
                pageCount: 24,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-2892805.jpg?1749037314",
                        artist: "Jeffrey Spokes"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-2590680.jpg?1749037314",
                        artist: "Clayton Crain"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-4671996.jpg?1749037314",
                        artist: "Brandon Peterson"
                    }
                ]
            },
            {
                issueNumber: 9,
                pageCount: 25,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-5009930.jpg?1752067904",
                        artist: "Gerald Parel"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-9112634.jpg?1753810007",
                        artist: "Rachta Lin"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-1425757.jpg?1752067904",
                        artist: "Lesley 'Leirix' Li"
                    }
                ]
            },
            {
                issueNumber: 10,
                pageCount: 25,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-2174275.jpg?1754503029",
                        artist: "Gerald Parel"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-2704689.jpg?1754503029",
                        artist: "Giuseppe Camuncoli"
                    }
                ]
            },
            {
                issueNumber: 11,
                pageCount: 25,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-1327393.jpg?1759344942",
                        artist: "Jeffrey Spokes"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-4195108.jpg?1759344942",
                        artist: "Karl Kerschl"
                    }
                ]
            },
            {
                issueNumber: 12,
                pageCount: 24,
                variantCovers: [
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-6732543.jpg?1759373197",
                        artist: "Mattia De Iulis "
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-2742283.jpg?1759373197",
                        artist: "Kris Anka"
                    },
                    {
                        url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-4964427.jpg?1759373197",
                        artist: "Jae Lee"
                    }
                ]
            },
        ]
    },
    {
        comicName: `Absolute-Batman`,
        logoChar: "b",
        artists: {
            author: "Scott Snyder",
            illustrator: "Nick Dragotta",
            colorist: "Frank Martin"
        },
        issues: [
            {   
                // title: "test",
                issueNumber: 1, 
                pageCount: 42 
            },
            {
                issueNumber: 2,
                pageCount: 25,
                // variantCovers: [
                //     {
                //         url: "https://s3.amazonaws.com/comicgeeks/comics/covers/large-9715787.jpg",
                //         artist: "Mico Suayan"
                //     }
                // ]
            },
            {   
                issueNumber: 3, 
                pageCount: 25
            },
            {   
                issueNumber: 4, 
                pageCount: 27
            },
            {   
                issueNumber: 5, 
                pageCount: 21
            },
            {   
                issueNumber: 6, 
                pageCount: 23
            },
            {   
                issueNumber: 7, 
                pageCount: 22
            },
            {   
                issueNumber: 8, 
                pageCount: 22
            },
            {   
                issueNumber: 9, 
                pageCount: 23
            },
            {   
                issueNumber: 10, 
                pageCount: 22
            },
            {   
                issueNumber: 11, 
                pageCount: 23
            },
            {   
                issueNumber: 12, 
                pageCount: 21
            },
        ]
    },
];