// default query configurations
/_
\*\*
cahche time: 5000 ms
*** backgroound fetching stop (staleTime will do this for you)
staleTime: 1000 ms *** (by default it is set to 0)
refetchOnMount: true *** (by default it is set to true)
refetchOnWIndowFocus: true *** (by default it is set to true)
refetchInterval: 1000 ms *** (by default it is set to 0)
refetchIntervalInBackground: 1000 ms *** (by default it is set to 0) // refetch even when the app is in background
select : (data) => data.data (DATA TRANSFORMATION FUNCTION)
_/
