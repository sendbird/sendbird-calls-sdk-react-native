package com.sendbird.calls.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.sendbird.calls.*
import com.sendbird.calls.reactnative.utils.CallsUtils

enum class QueryType {
    DIRECT_CALL_LOG,
    ROOM_LIST
}

class CallsQueries {
    val directCallLogQueries = mutableMapOf<String, DirectCallLogListQuery>()
    val roomListQueries = mutableMapOf<String, RoomListQuery>()

    fun createDirectCallLogListQuery(params: ReadableMap, promise: Promise) {
        val queryParams = DirectCallLogListQuery.Params().apply {
            val myRole = CallsUtils.safeGet {
                params.getString("myRole")?.let { DirectCallUserRole.valueOf(it) }
            }
            val limit = CallsUtils.safeGet {
                params.getInt("limit")
            }
            val endResults = CallsUtils.safeGet {
                params.getArray("endResults")?.toArrayList()?.map {
                    DirectCallEndResult.valueOf(it as String)
                }
            }

            if(myRole != null) setMyRole(myRole)
            if(limit != null) setLimit(limit)
            if(endResults != null) setEndResults(endResults)
        }

        val query = SendBirdCall.createDirectCallLogListQuery(queryParams)
        val key = query.hashCode().toString()
        directCallLogQueries[key] = query
        promise.resolve(key)
    }

    fun createRoomListQuery(params: ReadableMap, promise: Promise) {
        val queryParams = RoomListQuery.Params().apply {
            val limit = CallsUtils.safeGet {
                params.getInt("limit")
            }
            val createdByUserIds = CallsUtils.safeGet {
                params.getArray("createdByUserIds")?.toArrayList()?.map { it as String }
            }
            val roomIds = CallsUtils.safeGet {
                params.getArray("roomIds")?.toArrayList()?.map { it as String }
            }
            val state = CallsUtils.safeGet {
                params.getString("state")?.let { RoomState.valueOf(it) }
            }
            val type = CallsUtils.safeGet {
                params.getString("type")?.let { RoomType.valueOf(it) }
            }

            if(limit != null) setLimit(limit)
            if(createdByUserIds != null) setCreatedByUserIds(createdByUserIds)
            if(roomIds != null) setRoomIds(roomIds)
            if(state != null) setState(state)
            if(type != null) setType(type)

            // FIXME: Range methods are internal.
//            val createdAtRange = CallsUtils.safeGet {
//                val range = Range()
//                val createdAt = params.getMap("createdAt") ?: WritableNativeMap()
//                CallsUtils
//                    .safeGet { createdAt.getDouble("lowerBound") }
//                    ?.let { range.greaterThanOrEqualTo(it.toLong()) }
//                CallsUtils
//                    .safeGet { createdAt.getDouble("upperBound") }
//                    ?.let { range.lessThanOrEqualTo(it.toLong()) }
//                range
//            }
//
//            val participantCountRange = CallsUtils.safeGet {
//                val range = Range()
//                val count = params.getMap("currentParticipantCount")
//                CallsUtils
//                    .safeGet { count?.getDouble("lowerBound") }
//                    ?.let { range.greaterThanOrEqualTo(it.toLong()) }
//                CallsUtils
//                    .safeGet { count?.getDouble("upperBound") }
//                    ?.let { range.lessThanOrEqualTo(it.toLong()) }
//                range
//            }
        }
        val query = SendBirdCall.createRoomListQuery(queryParams)
        val key = query.hashCode().toString()
        roomListQueries[key] = query
        promise.resolve(key)
    }

    fun queryNext(key: String, type: String, promise: Promise) {
        when(QueryType.valueOf(type)) {
            QueryType.DIRECT_CALL_LOG -> {
                val query = directCallLogQueries[key]
                query?.next { list, e ->
                    if(e != null) promise.reject(e)
                    if(list != null) {
                        promise.resolve(CallsUtils.convertToJsMap(mapOf(
                            "hasNext" to query.hasNext(),
                            "result" to list.map {
                                CallsUtils.convertDirectCallLogToJsMap(it)
                            },
                        )))
                    }
                }
            }
            QueryType.ROOM_LIST -> {
                val query = roomListQueries[key]
                query?.next { list, e ->
                    if(e != null) promise.reject(e)
                    else {
                        promise.resolve(CallsUtils.convertToJsMap(mapOf(
                            "hasNext" to query.hasNext(),
                            "result" to list.map {
                                CallsUtils.convertRoomToJsMap(it)
                            }
                        )))
                    }
                }

            }
            else -> {
                promise.resolve(CallsUtils.convertToJsMap(mapOf(
                    "hasNext" to false,
                    "result" to WritableNativeArray()
                )))
            }
        }
    }
    fun queryRelease(key: String) {
        directCallLogQueries.remove(key)
        roomListQueries.remove(key)
    }
}